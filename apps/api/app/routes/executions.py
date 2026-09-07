"""Route d'exécution de workflows — POST /run + SSE stream."""

import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession
from sse_starlette.sse import EventSourceResponse

from app.core.database import get_session, get_session_factory
from app.core.deps import get_current_user
from app.models.models import Execution, User, Workflow
from app.services.executor import run_workflow

router = APIRouter(prefix="/workflows", tags=["executions"])


@router.post("/{workflow_id}/run")
async def run_workflow_endpoint(
    workflow_id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> dict:
    """Lance l'exécution d'un workflow et renvoie l'ID d'exécution."""
    result = await session.execute(select(Workflow).where(Workflow.id == workflow_id))
    workflow = result.scalar_one_or_none()
    if not workflow or workflow.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Workflow introuvable")

    execution = Execution(workflow_id=workflow_id, status="pending")
    session.add(execution)
    await session.commit()
    await session.refresh(execution)

    return {
        "execution_id": execution.id,
        "workflow_id": workflow_id,
        "status": "pending",
    }


@router.get("/{workflow_id}/executions")
async def list_executions(
    workflow_id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> list[dict]:
    """Liste les exécutions d'un workflow."""
    wf_result = await session.execute(select(Workflow).where(Workflow.id == workflow_id))
    workflow = wf_result.scalar_one_or_none()
    if not workflow or workflow.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Workflow introuvable")

    result = await session.execute(
        select(Execution)
        .where(Execution.workflow_id == workflow_id)
        .order_by(Execution.created_at.desc())
        .limit(50)
    )
    return [
        {
            "id": ex.id,
            "status": ex.status,
            "node_states": ex.node_states,
            "started_at": ex.started_at.isoformat() if ex.started_at else None,
            "finished_at": ex.finished_at.isoformat() if ex.finished_at else None,
            "created_at": ex.created_at.isoformat(),
        }
        for ex in result.scalars().all()
    ]


# ---------- SSE route séparée ----------

sse_router = APIRouter(prefix="/executions", tags=["executions"])


@sse_router.get("/{execution_id}/stream")
async def stream_execution(
    execution_id: int,
    user: User = Depends(get_current_user),
):
    """Stream SSE des événements d'exécution d'un workflow."""
    session_factory = get_session_factory()

    async def generate():
        async with session_factory() as session:
            result = await session.execute(select(Execution).where(Execution.id == execution_id))
            execution = result.scalar_one_or_none()
            if not execution:
                yield {"event": "error", "data": json.dumps({"message": "Exécution introuvable"})}
                return

            wf_result = await session.execute(
                select(Workflow).where(Workflow.id == execution.workflow_id)
            )
            workflow = wf_result.scalar_one_or_none()
            if not workflow or workflow.owner_id != user.id:
                yield {"event": "error", "data": json.dumps({"message": "Exécution introuvable"})}
                return

            async for sse_event in run_workflow(workflow, execution, session):
                # sse-starlette n'encode pas les dicts : on passe du JSON déjà sérialisé
                yield {"event": sse_event["event"], "data": json.dumps(sse_event["data"])}

    return EventSourceResponse(generate())