"""Moteur DAG — tri topologique de Kahn avec niveaux parallèles.

Le DAG est extrait de la définition JSON du workflow (@xyflow/react).
Chaque nœud est exécuté au plus tôt (as soon as possible) selon ses dépendances.
Les nœuds sans dépendances sont les *roots* et tournent au niveau 0.
"""

from __future__ import annotations

import logging
from collections import deque
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


@dataclass
class DAGNode:
    id: str
    type: str
    data: dict = field(default_factory=dict)
    incoming: set[str] = field(default_factory=set)
    outgoing: set[str] = field(default_factory=set)


@dataclass
class DAGLevel:
    level: int
    node_ids: list[str]


def build_dag(nodes: list[dict], edges: list[dict]) -> dict[str, DAGNode]:
    """Construit le dictionnaire de nœuds DAG à partir du format @xyflow/react."""
    dag: dict[str, DAGNode] = {}
    for n in nodes:
        dag[n["id"]] = DAGNode(id=n["id"], type=n["type"], data=n.get("data", {}))
    for e in edges:
        src, tgt = e["source"], e["target"]
        if src in dag and tgt in dag:
            dag[src].outgoing.add(tgt)
            dag[tgt].incoming.add(src)
    return dag


def topological_levels(dag: dict[str, DAGNode]) -> list[DAGLevel]:
    """Retourne les nœuds groupés par niveau d'exécution parallèle (Kahn)."""
    in_degree: dict[str, int] = {nid: len(d.incoming) for nid, d in dag.items()}
    queue: deque[str] = deque(nid for nid, d in dag.items() if d.incoming == set())
    levels: list[DAGLevel] = []
    level_num = 0

    while queue:
        current = list(queue)
        levels.append(DAGLevel(level=level_num, node_ids=current))
        next_queue: deque[str] = deque()
        for nid in current:
            for child in dag[nid].outgoing:
                in_degree[child] -= 1
                if in_degree[child] == 0:
                    next_queue.append(child)
        queue = next_queue
        level_num += 1

    visited = len(levels) and sum(len(lv.node_ids) for lv in levels)
    if visited < len(dag):
        raise ValueError(f"Le graphe contient un cycle — {len(dag) - visited} nœuds non visités")
    return levels


def validate_dag(nodes: list[dict], edges: list[dict]) -> list[str]:
    """Validation rapide : vérifie que le graphe est un DAG acyclique."""
    try:
        dag = build_dag(nodes, edges)
        topological_levels(dag)
        return []
    except ValueError as exc:
        return [str(exc)]
