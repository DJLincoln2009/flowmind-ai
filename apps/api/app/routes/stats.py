"""Routes statistiques — KPI du dashboard.

- GET /stats : compteurs agrégés (workflows, exécutions, taux de succès, durée
  moyenne) + dernières exécutions pour l'activity feed.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.core.deps import get_current_user
from app.models.models import Execution, User, Workflow

router = APIRouter(prefix="/stats", tags=["stats"])

RECENT_EXECUTIONS_LIMIT = 6


def _execution_payload(ex: Execution, workflow_name: str) -> dict:
    """Sérialise une exécution + nom du workflow + durée calculée (ms)."""
    duration_ms = None
    if ex.started_at and ex.finished_at:
        duration_ms = int((ex.finished_at - ex.started_at).total_seconds() * 1000)
    return {
        "id": ex.id,
        "workflow_id": ex.workflow_id,
        "workflow_name": workflow_name,
        "status": ex.status,
        "created_at": ex.created_at.isoformat(),
        "started_at": ex.started_at.isoformat() if ex.started_at else None,
        "finished_at": ex.finished_at.isoformat() if ex.finished_at else None,
        "duration_ms": duration_ms,
    }


async def _list_recent_executions(
    session: AsyncSession, user: User, limit: int
) -> list[dict]:
    result = await session.execute(
        select(Execution, Workflow.name)
        .join(Workflow, Workflow.id == Execution.workflow_id)
        .where(Workflow.owner_id == user.id)
        .order_by(Execution.created_at.desc())
        .limit(limit)
    )
    return [_execution_payload(ex, name) for ex, name in result.all()]


@router.get("")
async def dashboard_stats(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> dict:
    """Indicateurs du tableau de bord (workflows, exécutions, taux de succès)."""
    wf_result = await session.execute(select(Workflow).where(Workflow.owner_id == user.id))
    workflows = wf_result.scalars().all()
    workflows_total = len(workflows)
    workflows_active = sum(1 for wf in workflows if wf.is_active)

    exec_result = await session.execute(
        select(Execution, Workflow.name)
        .join(Workflow, Workflow.id == Execution.workflow_id)
        .where(Workflow.owner_id == user.id)
    )
    pairs = exec_result.all()

    executions_total = len(pairs)
    executions_success = sum(1 for ex, _ in pairs if ex.status == "success")
    success_rate = round(executions_success / executions_total, 2) if executions_total else 0.0

    durations = [
        int((ex.finished_at - ex.started_at).total_seconds() * 1000)
        for ex, _ in pairs
        if ex.started_at and ex.finished_at
    ]
    avg_duration_ms = round(sum(durations) / len(durations)) if durations else None

    recent = await _list_recent_executions(session, user, RECENT_EXECUTIONS_LIMIT)

    return {
        "workflows_total": workflows_total,
        "workflows_active": workflows_active,
        "executions_total": executions_total,
        "executions_success": executions_success,
        "execution_success_rate": success_rate,
        "avg_duration_ms": avg_duration_ms,
        "recent_executions": recent,
    }