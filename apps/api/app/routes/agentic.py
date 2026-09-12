"""Route Agentic — objectif → plan de workflow généré par IA.

Génération sans persistance (authentifié) : l'appelant crée ensuite le workflow
via POST /api/workflows pour conserver un seul chemin de validation du graphe.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.core.deps import get_current_user
from app.models.models import User
from app.schemas.workflow import AgenticCreate, AgenticPlanOut
from app.services.agentic import _sanitize_definition, generate_plan

router = APIRouter(prefix="/agentic", tags=["agentic"])


@router.post("/plan", response_model=AgenticPlanOut)
async def generate_workflow_plan(
    payload: AgenticCreate,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> AgenticPlanOut:
    """Génère un plan de workflow (nœuds + arêtes) à partir d'un objectif."""
    try:
        plan = await generate_plan(payload.objective)
        definition = _sanitize_definition(plan)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(
            status_code=502,
            detail="Impossible de générer le plan (tous les providers IA ont échoué)",
        ) from exc

    return AgenticPlanOut(
        name=plan.name,
        description=plan.description,
        definition=definition,
    )