"""Agentic execution — objectif → plan structuré de workflow via IA.

L'utilisateur décrit un objectif en langage naturel ; le LLM propose un plan
de workflow (nœuds + arêtes). Le plan est validé (types connus, graphe
acyclique) puis un workflow est créé.
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any

from pydantic import BaseModel, Field, ValidationError, field_validator

from app.services.ai_client import ai_client
from app.services.dag import build_dag

logger = logging.getLogger(__name__)

MAX_NODES = 10
MAX_EDGES = 12

# Manifeste des blocs proposables par le LLM (source de vérité du prompt).
NODE_MANIFEST: list[dict[str, Any]] = [
    {
        "type": "trigger",
        "label": "Déclencheur",
        "description": "Démarre le workflow et expose son payload comme entrée",
        "data": {"mode": "manual", "text": "exemple de texte à traiter"},
    },
    {
        "type": "ai_summary",
        "label": "Résumé IA",
        "description": "Résume le texte reçu en entrée",
        "data": {},
    },
    {
        "type": "ai_extract",
        "label": "Extraction IA",
        "description": "Extrait des champs (nom, email, date…) d'un texte",
        "data": {"fields": "nom, email, date"},
    },
    {
        "type": "ai_classify",
        "label": "Classification IA",
        "description": "Classe un texte dans des catégories",
        "data": {"categories": "positif, négatif, neutre"},
    },
    {
        "type": "ocr",
        "label": "OCR",
        "description": "Extrait le texte d'une image (URL requise)",
        "data": {"image_url": "https://exemple.com/image.png"},
    },
    {
        "type": "transcription",
        "label": "Transcription",
        "description": "Transcrit un fichier audio (URL requise)",
        "data": {"audio_url": "https://exemple.com/audio.mp3"},
    },
    {
        "type": "http_request",
        "label": "Requête HTTP",
        "description": "Appelle une URL (GET ou POST)",
        "data": {"url": "https://api.exemple.com/data", "method": "GET"},
    },
    {
        "type": "delay",
        "label": "Délai",
        "description": "Attend quelques secondes avant de continuer",
        "data": {"seconds": 2},
    },
    {
        "type": "condition",
        "label": "Condition",
        "description": "Filtre selon une expression simple (texte dans l'entrée)",
        "data": {"expression": "entrée contient 'urgent'"},
    },
    {
        "type": "output",
        "label": "Sortie",
        "description": "Termine le workflow et expose le résultat final",
        "data": {},
    },
]


class AgenticNode(BaseModel):
    id: str = Field(min_length=1, max_length=64)
    type: str
    data: dict[str, Any] = Field(default_factory=dict)

    @field_validator("id")
    @classmethod
    def _valid_id(cls, v: str) -> str:
        if not re.fullmatch(r"[a-zA-Z0-9_-]+", v):
            raise ValueError("id de nœud invalide")
        return v


class AgenticEdge(BaseModel):
    id: str = Field(min_length=1, max_length=64)
    source: str
    target: str


class AgenticPlan(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(default="", max_length=500)
    nodes: list[AgenticNode] = Field(min_length=2, max_length=MAX_NODES)
    edges: list[AgenticEdge] = Field(default_factory=list, max_length=MAX_EDGES)


def _system_prompt() -> str:
    blocks = ", ".join(
        f"{b['type']} ({b['label']} — {b['description']})" for b in NODE_MANIFEST
    )
    return (
        "Vous êtes un architecte de workflows d'automatisation. À partir d'un objectif, "
        "vous proposez un plan de workflow en doublant UNIQUEMENT des blocs parmi : "
        f"{blocks}.\n"
        "Contraintes strictes : le premier nœud est toujours « trigger », le dernier toujours "
        "« output ». Maximum 8 nœuds. Les arêtes relient les blocs dans l'ordre du traitement, "
        "sans cycle ni nœud hors séquence. La sortie doit être un objet JSON avec les clés : "
        "name (nom court du workflow), description (une phrase), nodes (liste de {id, type, data} "
        "avec des ids courts comme n1, n2…), edges (liste de {id, source, target}). "
        "Chaque nœud data doit contenir uniquement les clés énumérées ci-dessus quand elles "
        "sont requises."
    )


def _user_prompt(objective: str) -> str:
    return (
        f"Objectif de l'utilisateur : {objective}\n\n"
        "Générez le plan de workflow le plus pertinent et simple possible pour atteindre "
        "cet objectif. Répondez uniquement en JSON valide."
    )


def _sanitize_definition(plan: AgenticPlan) -> dict[str, Any]:
    """Valide le plan et produit une définition de workflow (graphe + positions)."""
    known = {b["type"] for b in NODE_MANIFEST}
    node_ids: set[str] = set()
    nodes_out: list[dict[str, Any]] = []
    edges_out: list[dict[str, Any]] = []

    for i, node in enumerate(plan.nodes):
        if node.type not in known:
            raise ValueError(f"Type de nœud inconnu : {node.type}")
        if node.id in node_ids:
            raise ValueError(f"Id de nœud dupliqué : {node.id}")
        node_ids.add(node.id)
        nodes_out.append(
            {
                "id": node.id,
                "type": node.type,
                "position": {"x": i * 260, "y": 60},
                "data": node.data,
            }
        )

    edge_used: set[tuple[str, str]] = set()
    for edge in plan.edges:
        if edge.source not in node_ids or edge.target not in node_ids:
            raise ValueError(f"Arête invalide : {edge.source} -> {edge.target}")
        if edge.source == edge.target:
            raise ValueError("Cycle direct interdit (source == target)")
        pair = (edge.source, edge.target)
        if pair in edge_used:
            raise ValueError(f"Arête dupliquée : {pair}")
        edge_used.add(pair)
        edges_out.append({"id": edge.id, "source": edge.source, "target": edge.target})

    # Le DAG doit être acyclique — build_dag lève ValueError sinon.
    build_dag(nodes_out, edges_out)
    if not any(n["type"] == "trigger" for n in nodes_out):
        raise ValueError("Le plan doit commencer par un nœud « trigger »")
    if not any(n["type"] == "output" for n in nodes_out):
        raise ValueError("Le plan doit finir par un nœud « output »")

    return {"nodes": nodes_out, "edges": edges_out}


async def generate_plan(objective: str) -> AgenticPlan:
    """Génère un plan de workflow à partir d'un objectif (appel IA + validation)."""
    try:
        raw = await ai_client.llm_json(
            _user_prompt(objective),
            system=_system_prompt(),
            temperature=0.4,
            max_tokens=2000,
        )
        plan = AgenticPlan.model_validate(raw)
    except (ValidationError, ValueError, json.JSONDecodeError) as exc:
        logger.warning("Agentic : plan invalide (%s)", exc)
        raise ValueError(f"Le modèle IA a renvoyé un plan invalide : {exc}") from exc
    return plan