from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.core.deps import get_current_user
from app.models.models import User, Workflow
from app.schemas.workflow import WorkflowCreate, WorkflowOut, WorkflowUpdate

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("", response_model=list[WorkflowOut])
async def list_workflows(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> list[Workflow]:
    result = await session.execute(
        select(Workflow).where(Workflow.owner_id == user.id).order_by(Workflow.updated_at.desc())
    )
    return list(result.scalars().all())


@router.post("", response_model=WorkflowOut, status_code=status.HTTP_201_CREATED)
async def create_workflow(
    payload: WorkflowCreate,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> Workflow:
    workflow = Workflow(owner_id=user.id, **payload.model_dump())
    session.add(workflow)
    await session.commit()
    await session.refresh(workflow)
    return workflow


@router.get("/{workflow_id}", response_model=WorkflowOut)
async def get_workflow(
    workflow_id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> Workflow:
    workflow = await _get_owned(workflow_id, user.id, session)
    return workflow


@router.patch("/{workflow_id}", response_model=WorkflowOut)
async def update_workflow(
    workflow_id: int,
    payload: WorkflowUpdate,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> Workflow:
    workflow = await _get_owned(workflow_id, user.id, session)
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(workflow, key, value)
    await session.commit()
    await session.refresh(workflow)
    return workflow


@router.delete("/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workflow(
    workflow_id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> None:
    workflow = await _get_owned(workflow_id, user.id, session)
    await session.delete(workflow)
    await session.commit()


async def _get_owned(workflow_id: int, owner_id: int, session: AsyncSession) -> Workflow:
    result = await session.execute(
        select(Workflow).where(Workflow.id == workflow_id, Workflow.owner_id == owner_id)
    )
    workflow = result.scalar_one_or_none()
    if workflow is None:
        raise HTTPException(status_code=404, detail="Workflow introuvable")
    return workflow
