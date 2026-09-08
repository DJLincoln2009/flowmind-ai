from fastapi import APIRouter

from app.services.templates import TEMPLATES

router = APIRouter(prefix="/templates", tags=["templates"])


@router.get("")
async def list_templates() -> list[dict]:
    """Liste les modèles de workflows prêts à l'emploi (public)."""
    return TEMPLATES