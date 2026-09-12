from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import String, cast, select
from sqlalchemy.dialects import postgresql
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import engine, get_session
from app.core.deps import get_current_user
from app.models.models import User, Workflow, WorkflowVersion, utcnow
from app.schemas.workflow import (
    VersionSaveIn,
    WorkflowCreate,
    WorkflowOut,
    WorkflowUpdate,
    WorkflowVersionOut,
)
from app.services.scheduler import is_valid_cron, next_run

router = APIRouter(prefix="/workflows", tags=["workflows"])


def _tags_as_text(column) -> object:
    """Rendu texte de la colonne JSON `tags`.

    SQLite : CAST(... AS VARCHAR) → texte JSON de la colonne.
    PostgreSQL : CAST(... AS TEXT) fonctionne sur jsonb (CAST AS VARCHAR est refusé).
    """
    if engine.dialect.name == "postgresql":
        return cast(column, postgresql.TEXT)
    return cast(column, String)


@router.get("/folders", response_model=list[str])
async def list_folders(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> list[str]:
    """Retourne la liste des dossiers utilisés par l'utilisateur (tri alphabétique)."""
    result = await session.execute(
        select(Workflow.folder)
        .where(Workflow.owner_id == user.id, Workflow.folder.is_not(None))
        .distinct()
    )
    folders = sorted(f for (f,) in result.all() if f)
    return folders


@router.get("", response_model=list[WorkflowOut])
async def list_workflows(
    search: str | None = Query(default=None, max_length=120),
    folder: str | None = Query(default=None, max_length=80),
    tag: list[str] | None = Query(default=None),
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> list[Workflow]:
    stmt = select(Workflow).where(Workflow.owner_id == user.id)

    if search:
        like = f"%{search.lower()}%"
        stmt = stmt.where(
            (Workflow.name.like(like))
            | (Workflow.description.like(like))
            | (Workflow.folder.like(like))
            | (_tags_as_text(Workflow.tags).like(like))
        )
    if folder:
        stmt = stmt.where(Workflow.folder == folder)
    for t in tag or []:
        stmt = stmt.where(_tags_as_text(Workflow.tags).like(f"%{t.lower()}%"))

    result = await session.execute(stmt.order_by(Workflow.updated_at.desc()))
    return list(result.scalars().all())


@router.post("", response_model=WorkflowOut, status_code=status.HTTP_201_CREATED)
async def create_workflow(
    payload: WorkflowCreate,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> Workflow:
    data = payload.model_dump()
    if data.get("tags") is None:
        data["tags"] = []
    workflow = Workflow(owner_id=user.id, **data)
    session.add(workflow)
    await session.commit()
    await session.refresh(workflow)
    return workflow


@router.get("/{workflow_id}/versions", response_model=list[WorkflowVersionOut])
async def list_versions(
    workflow_id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> list[WorkflowVersion]:
    workflow = await _get_owned(workflow_id, user.id, session)
    result = await session.execute(
        select(WorkflowVersion)
        .where(WorkflowVersion.workflow_id == workflow.id)
        .order_by(WorkflowVersion.created_at.desc())
    )
    return list(result.scalars().all())


@router.post(
    "/{workflow_id}/versions/save",
    response_model=WorkflowVersionOut,
    status_code=status.HTTP_201_CREATED,
)
async def save_version(
    workflow_id: int,
    payload: VersionSaveIn,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> WorkflowVersion:
    workflow = await _get_owned(workflow_id, user.id, session)
    version = WorkflowVersion(
        workflow_id=workflow.id,
        label=payload.label or None,
        definition=workflow.definition or {},
    )
    session.add(version)
    await session.commit()
    await session.refresh(version)
    return version


@router.post("/{workflow_id}/versions/{version_id}/restore", response_model=WorkflowOut)
async def restore_version(
    workflow_id: int,
    version_id: int,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> Workflow:
    workflow = await _get_owned(workflow_id, user.id, session)
    result = await session.execute(
        select(WorkflowVersion).where(
            WorkflowVersion.id == version_id, WorkflowVersion.workflow_id == workflow.id
        )
    )
    version = result.scalar_one_or_none()
    if version is None:
        raise HTTPException(status_code=404, detail="Version introuvable")
    workflow.definition = version.definition
    workflow.updated_at = utcnow()
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

    # Planification : valide l'expression cron et recalcule la prochaine exécution
    if "cron" in data:
        cron = data["cron"]
        if cron is None or cron.strip() == "":
            data["cron"] = None
            data["next_run_at"] = None
        elif not is_valid_cron(cron):
            raise HTTPException(status_code=400, detail="Expression cron invalide")
        else:
            data["cron"] = cron.strip()
            data["next_run_at"] = next_run(cron.strip())

    # Workspace : pas de null sur tags (colonne non-null)
    if "tags" in data and data["tags"] is None:
        data["tags"] = []

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
