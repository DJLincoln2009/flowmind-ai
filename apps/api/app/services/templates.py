"""Modèles de workflows prêts à l'emploi (boutique de templates).

Chaque template est un graphe complet compatible `@xyflow/react` (nodes + edges)
que le frontend peut instancier en un clic. Les nœuds référencent les types
enregistrés par `services/nodes.py` via `execute_node`.
"""

from __future__ import annotations

from typing import Any

# ---------- Helpers ----------

Node = dict[str, Any]
Edge = dict[str, Any]


def _node(node_id: str, node_type: str, x: int, y: int, data: dict[str, Any]) -> Node:
    return {"id": node_id, "type": node_type, "position": {"x": x, "y": y}, "data": data}


def _edge(edge_id: str, source: str, target: str) -> Edge:
    return {"id": edge_id, "source": source, "target": target}


def _chain(types: list[tuple[str, str, dict[str, Any]]], start_x: int = 60, step: int = 300) -> dict[str, Any]:
    """Bâtit une chaîne linéaire de nœuds + leurs arêtes (positions espacées)."""
    nodes: list[Node] = []
    edges: list[Edge] = []
    for i, (node_id, node_type, data) in enumerate(types):
        nodes.append(_node(node_id, node_type, start_x + i * step, 140, data))
        if i > 0:
            prev_id = types[i - 1][0]
            edges.append(_edge(f"{prev_id}-{node_id}", prev_id, node_id))
    return {"nodes": nodes, "edges": edges}


TEMPLATES: list[dict[str, Any]] = [
    {
        "id": "classification-avis",
        "name": "Classification d'avis",
        "description": "Classe automatiquement un avis ou un texte dans des catégories prédéfinies (positif, négatif, neutre…).",
        "category": "IA",
        "icon": "Braces",
        "definition": _chain([
            ("dcl", "trigger", {"label": "Déclencheur", "mode": "manual"}),
            ("cls", "ai_classify", {"label": "Classification", "categories": "positif, négatif, neutre"}),
            ("out", "output", {"label": "Sortie"}),
        ]),
    },
    {
        "id": "resume-document",
        "name": "Résumé de document",
        "description": "Condense n'importe quel texte (article, email, rapport) en un résumé clair et structuré.",
        "category": "IA",
        "icon": "Sparkles",
        "definition": _chain([
            ("dcl", "trigger", {"label": "Déclencheur", "mode": "manual"}),
            ("sum", "ai_summary", {"label": "Résumé IA"}),
            ("out", "output", {"label": "Sortie"}),
        ]),
    },
    {
        "id": "extraction-informations",
        "name": "Extraction d'informations",
        "description": "Extrait des champs structurés (nom, email, montant…) à partir d'un texte brut.",
        "category": "IA",
        "icon": "FileText",
        "definition": _chain([
            ("dcl", "trigger", {"label": "Déclencheur", "mode": "manual"}),
            ("ext", "ai_extract", {"label": "Extraction IA", "fields": "nom, email, date"}),
            ("out", "output", {"label": "Sortie"}),
        ]),
    },
    {
        "id": "veille-page-web",
        "name": "Veille de page web",
        "description": "Récupère le contenu d'une page web et en extrait les informations clés à chaque exécution.",
        "category": "Données",
        "icon": "Globe",
        "definition": _chain([
            ("dcl", "trigger", {"label": "Déclencheur", "mode": "manual"}),
            ("http", "http_request", {"label": "Requête HTTP", "method": "GET", "url": "https://example.com"}),
            ("ext", "ai_extract", {"label": "Extraction IA", "fields": "titre, résumé, date"}),
            ("out", "output", {"label": "Sortie"}),
        ]),
    },
    {
        "id": "numerisation-document",
        "name": "Numérisation de document",
        "description": "Reconnaît le texte d'une image (OCR) puis en extrait les données structurées.",
        "category": "Données",
        "icon": "ScanText",
        "definition": _chain([
            ("dcl", "trigger", {"label": "Déclencheur", "mode": "manual"}),
            ("ocr", "ocr", {"label": "OCR Image"}),
            ("ext", "ai_extract", {"label": "Extraction IA", "fields": "référence, date, montant"}),
            ("out", "output", {"label": "Sortie"}),
        ]),
    },
    {
        "id": "transcription-resume",
        "name": "Transcription + résumé",
        "description": "Transcrit un fichier audio (réunion, note vocale) puis génère un résumé structuré.",
        "category": "Données",
        "icon": "AudioLines",
        "definition": _chain([
            ("dcl", "trigger", {"label": "Déclencheur", "mode": "manual"}),
            ("trans", "transcription", {"label": "Transcription"}),
            ("sum", "ai_summary", {"label": "Résumé IA"}),
            ("out", "output", {"label": "Sortie"}),
        ]),
    },
]