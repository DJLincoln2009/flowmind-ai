"""Planificateur de workflows (cron interne).

Tâche asyncio démarrée au lifespan de l'application. Toutes les N secondes :
1. Cherche les workflows avec une expression `cron` et `is_active=True`
2. Calcule la prochaine exécution via `croniter` (jamais deux fois le même)
3. Exécute le DAG complet côté serveur (aucun client connecté requis)
"""

from __future__ import annotations

import asyncio
import logging
from datetime import UTC, datetime

from croniter import croniter
from sqlalchemy import select

from app.core.database import SessionLocal
from app.models.models import Execution, Workflow
from app.services.executor import run_workflow

logger = logging.getLogger(__name__)

# Intervalle de scrutation (in fine, les exécutions déclenchées par cron).
SCHEDULER_INTERVAL_SECONDS = 15

_tick_lock = asyncio.Lock()


def utcnow_naive() -> datetime:
    """Heure UTC « naive » — SQLite ne conserve pas le timezone des colonnes
    DateTime(timezone=True) : on compare donc des datetimes sans tzinfo."""
    return datetime.now(UTC).replace(tzinfo=None)


def next_run(cron: str, base: datetime | None = None) -> datetime:
    """Retourne la prochaine exécution (UTC naive) pour une expression cron."""
    return croniter(cron, base or utcnow_naive()).get_next(datetime)


def is_valid_cron(cron: str) -> bool:
    try:
        croniter(cron)
        return True
    except (ValueError, KeyError):
        return False


async def scheduler_loop() -> None:
    """Boucle du planificateur — lancée en tâche de fond au démarrage."""
    while True:
        try:
            async with _tick_lock:
                await _tick()
        except Exception:
            logger.exception("Tick du planificateur en erreur")
        await asyncio.sleep(SCHEDULER_INTERVAL_SECONDS)


async def _tick() -> None:
    now = utcnow_naive()
    due_ids: list[int] = []

    async with SessionLocal() as session:
        result = await session.execute(
            select(Workflow).where(Workflow.cron.is_not(None), Workflow.is_active.is_(True))
        )
        for wf in result.scalars().all():
            if not is_valid_cron(wf.cron or ""):
                wf.next_run_at = None
                session.add(wf)
                continue
            if wf.next_run_at is None:
                wf.next_run_at = next_run(wf.cron or "")
                session.add(wf)
            elif wf.next_run_at <= now:
                due_ids.append(wf.id)
        await session.commit()

    for workflow_id in due_ids:
        await _execute_due(workflow_id, now)


async def _execute_due(workflow_id: int, now: datetime) -> None:
    async with SessionLocal() as session:
        workflow = await session.get(Workflow, workflow_id)
        if not workflow:
            return

        execution = Execution(workflow_id=workflow.id, status="pending")
        session.add(execution)
        await session.commit()
        await session.refresh(execution)

        try:
            async for _event in run_workflow(workflow, execution, session):
                pass
        except Exception:
            logger.exception("Workflow planifié %s en erreur", workflow_id)

        try:
            workflow.next_run_at = next_run(workflow.cron or "")
        except (ValueError, KeyError):
            workflow.next_run_at = None
        session.add(workflow)
        await session.commit()

        logger.info(
            "Exécution planifiée %s — workflow %s (%s), prochaine run à %s",
            execution.id,
            workflow.id,
            workflow.name,
            workflow.next_run_at,
        )