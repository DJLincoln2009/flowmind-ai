"""Templates marketplace — modèles officiels (built-in) + créations des utilisateurs."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.database import get_session
from app.core.deps import get_current_user
from app.models.models import Template, User
from app.services.templates import TEMPLATES as BUILTIN_TEMPLATES

router = APIRouter(prefix="/templates", tags=["templates"])


class TemplateCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(default="", max_length=500)
    category: str = Field(default="personnalisé", max_length=40)
    icon: str = Field(default="LayoutTemplate", max_length=40)
    definition: dict = Field(default_factory=dict)

    @field_validator("name", "category", "icon")
    @classmethod
    def _strip(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Champ requis")
        return v


def _slug(name: str) -> str:
    base = "".join(c for c in name.lower() if c.isalnum() or c in "-_ ").strip().replace(" ", "-")
    return base or "template"


@router.get("")
async def list_templates(
    session: AsyncSession = Depends(get_session),
) -> list[dict]:
    """Liste les modèles : officiels puis publications des utilisateurs (public)."""
    result = await session.execute(select(Template).order_by(Template.created_at.desc()))
    user_templates = [
        {
            "id": f"u{t.id}",
            "name": t.name,
            "description": t.description or "",
            "category": t.category or "personnalisé",
            "icon": t.icon or "LayoutTemplate",
            "definition": t.definition or {},
            "source": "user",
        }
        for t in result.scalars().all()
    ]
    return [
        {**t, "id": f"b{t['id']}", "source": "builtin"} for t in BUILTIN_TEMPLATES
    ] + user_templates


@router.post("", status_code=status.HTTP_201_CREATED)
async def publish_template(
    payload: TemplateCreate,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> dict:
    """Publie un workflow comme template du marketplace (propriété de l'utilisateur)."""
    nodes = (payload.definition or {}).get("nodes", [])
    if not nodes:
        raise HTTPException(status_code=422, detail="Definition vide — aucun nœud")

    tpl = Template(
        owner_id=user.id,
        template_key=f"{_slug(payload.name)}-{uuid.uuid4().hex[:8]}",
        name=payload.name,
        description=payload.description,
        category=payload.category,
        icon=payload.icon,
        definition=payload.definition,
    )
    session.add(tpl)
    await session.commit()
    await session.refresh(tpl)
    return {
        "id": f"u{tpl.id}",
        "name": tpl.name,
        "description": tpl.description,
        "category": tpl.category,
        "icon": tpl.icon,
        "definition": tpl.definition,
        "source": "user",
    }


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    template_id: str,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user),
) -> None:
    """Supprime une publication utilisateur (uniquement son propriétaire)."""
    if not template_id.startswith("u"):
        raise HTTPException(status_code=403, detail="Impossible de supprimer un modèle officiel")
    try:
        row_id = int(template_id[1:])
    except ValueError:
        raise HTTPException(status_code=404, detail="Modèle introuvable") from None

    result = await session.execute(select(Template).where(Template.id == row_id))
    tpl = result.scalar_one_or_none()
    if tpl is None or tpl.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Modèle introuvable")
    await session.delete(tpl)
    await session.commit()