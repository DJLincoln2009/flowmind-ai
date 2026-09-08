"""Moteur d'exécution des workflows — DAG + SSE streaming.

Orchestre l'exécution d'un workflow :
1. Parse le graphe JSON du workflow
2. Construit le DAG (tri topologique)
3. Exécute nœud par nœud, niveau par niveau (parallèle pour même niveau)
4. Émet des événements SSE en temps réel (node status, output)
5. Gère les erreurs (un nœud en erreur bloque ses enfants)
"""

from __future__ import annotations

import asyncio
import logging
from collections.abc import AsyncGenerator
from datetime import UTC, datetime
from typing import Any

from sqlmodel.ext.asyncio.session import AsyncSession

from app.models.models import Execution, User, Workflow
from app.services.dag import DAGNode, build_dag, topological_levels
from app.services.nodes import execute_node
from app.services.notifier import notify_execution_completed

logger = logging.getLogger(__name__)

# Type alias pour les événements SSE émis par le moteur
SSEEvent = dict[str, Any]


async def run_workflow(
    workflow: Workflow,
    execution: Execution,
    session: AsyncSession,
    *,
    initial_inputs: dict[str, Any] | None = None,
) -> AsyncGenerator[SSEEvent]:
    """Générateur qui exécute le workflow et yield des événements SSE (dicts)."""
    definition = workflow.definition or {}
    nodes = definition.get("nodes", [])
    edges = definition.get("edges", [])

    if not nodes:
        yield {"event": "error", "data": {"message": "Workflow vide — aucun nœud"}}
        return

    # Construction du DAG
    try:
        dag = build_dag(nodes, edges)
        levels = topological_levels(dag)
    except ValueError as exc:
        yield {"event": "error", "data": {"message": f"Graphe invalide : {exc}"}}
        return

    # Mise à jour de l'exécution
    execution.status = "running"
    execution.started_at = datetime.now(UTC)
    execution.node_states = {}
    execution.logs = []
    session.add(execution)
    await session.commit()

    yield {"event": "start", "data": {"execution_id": execution.id, "levels": len(levels)}}

    node_outputs: dict[str, Any] = {}
    overall_success = True

    for level in levels:
        # Tous les nœuds du même niveau tournent en parallèle
        tasks = [
            _run_node_safe(dag[node_id], dag, node_outputs, initial_inputs or {})
            for node_id in level.node_ids
        ]
        results = await asyncio.gather(*tasks, return_exceptions=False)

        for node_id, result in zip(level.node_ids, results):
            dag_node = dag[node_id]
            status_val = "success" if "error" not in result else "error"
            output = result.get("output", {})
            error = result.get("error")

            # Mise à jour de l'état du nœud
            execution.node_states[node_id] = {
                "status": status_val,
                "output": output,
                "error": error,
            }
            node_outputs[node_id] = output

            yield {
                "event": "node",
                "data": {
                    "node_id": node_id,
                    "node_type": dag_node.type,
                    "status": status_val,
                    "output": output,
                    "error": error,
                },
            }

            if status_val == "error":
                overall_success = False
                execution.logs.append({
                    "node_id": node_id,
                    "type": dag_node.type,
                    "status": "error",
                    "error": error,
                })

            session.add(execution)
            await session.commit()

    # Finalisation
    execution.status = "success" if overall_success else "error"
    execution.finished_at = datetime.now(UTC)
    session.add(execution)
    await session.commit()

    yield {
        "event": "end",
        "data": {
            "execution_id": execution.id,
            "status": execution.status,
            "node_states": execution.node_states,
        },
    }

    # Notification email best-effort (fire-and-forget, non bloquante)
    try:
        user = await session.get(User, workflow.owner_id)
        if user and user.email:
            duration_ms = None
            if execution.started_at and execution.finished_at:
                duration_ms = int(
                    (execution.finished_at - execution.started_at).total_seconds() * 1000
                )
            task = asyncio.create_task(
                notify_execution_completed(
                    user.email, workflow.name, execution.status, duration_ms
                )
            )
            task.add_done_callback(
                lambda t: t.exception() if not t.cancelled() else None
            )
    except Exception:
        logger.warning("Notification de fin d'exécution échouée", exc_info=True)


async def _run_node_safe(
    dag_node: DAGNode,
    dag: dict[str, DAGNode],
    node_outputs: dict[str, Any],
    initial_inputs: dict[str, Any],
) -> dict[str, Any]:
    """Exécute un nœud de manière safe, en capturant les erreurs."""
    try:
        # Collecte les inputs depuis les nœuds parents
        inputs: dict[str, Any] = {}
        for parent_id in dag_node.incoming:
            inputs.update(node_outputs.get(parent_id, {}))

        # Le trigger reçoit les inputs initiaux
        if dag_node.type == "trigger":
            inputs.update(initial_inputs)

        output = await execute_node(dag_node.type, dag_node.data, inputs)
        return {"output": output}
    except Exception as exc:  # noqa: BLE001 — un nœud ne doit jamais casser le workflow entier
        logger.error("Nœud %s (%s) en erreur : %s", dag_node.id, dag_node.type, exc)
        return {"error": str(exc), "output": {}}