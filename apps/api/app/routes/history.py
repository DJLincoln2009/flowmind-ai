"""Route historique — toutes les exécutions de l'utilisateur.

- GET /executions : dernières exécutions (tous workflows confondus).
"""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.core.deps import get_current_user
from app.models.models import Execution, User, Workflow
from app.routes.stats import _execution_payload

router = APIRouter(prefix="/executions", tags=["history"])

HISTORY_LIMIT = 100


@router.get("")
async def list_all_executions(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> list[dict]:
    """Toutes les exécutions de l'utilisateur, de la plus récente à la plus ancienne."""
    result = await session.execute(
        select(Execution, Workflow.name)
        .join(Workflow, Workflow.id == Execution.workflow_id)
        .where(Workflow.owner_id == user.id)
        .order_by(Execution.created_at.desc())
        .limit(HISTORY_LIMIT)
    )
    return [_execution_payload(ex, name) for ex, name in result.all()]