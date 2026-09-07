"""Notifications sortantes — email best-effort via SMTP (stdlib).

Si aucun SMTP n'est configuré dans `.env` (`FLOWMIND_SMTP_HOST`), la
notification est simplement loguée. Budget $0 : l'utilisateur fournit ses
propres identifiants SMTP (Gmail, Mailtrap, etc.) — aucun service payant.
"""

import asyncio
import logging
import smtplib
from email.message import EmailMessage

from app.core.config import settings

logger = logging.getLogger(__name__)


def _smtp_connection() -> smtplib.SMTP:
    """Ouvre une connexion SMTP (SSL direct ou STARTTLS)."""
    if settings.smtp_ssl:
        return smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=10)
    server = smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10)
    server.starttls()
    return server


def send_email(to: str, subject: str, body: str) -> bool:
    """Envoie un email. Retourne False si le SMTP n'est pas configuré."""
    if not settings.smtp_host or not to:
        logger.info("Email ignoré (SMTP non configuré) — %s : %s", to, subject)
        return False

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = settings.smtp_from or settings.smtp_username
    message["To"] = to
    message.set_content(body)

    try:
        with _smtp_connection() as server:
            if settings.smtp_username:
                server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(message)
        logger.info("Email envoyé à %s : %s", to, subject)
        return True
    except Exception:
        logger.warning("Échec d'envoi d'email à %s", to, exc_info=True)
        return False


async def notify_execution_completed(
    email: str, workflow_name: str, status: str, duration_ms: int | None
) -> None:
    """Notification fire-and-forget de fin d'exécution (non bloquante)."""
    if not settings.smtp_host or not email:
        return

    result = "succès" if status == "success" else "échec"
    duration = f"{round(duration_ms / 1000, 1)} s" if duration_ms is not None else "—"
    subject = f"[FlowMind] {workflow_name} — exécution {result}"
    body = (
        f"Votre workflow « {workflow_name} » s'est terminé en {result}.\n"
        f"Statut : {status}\nDurée : {duration}\n\n"
        "— FlowMind AI automatisation intelligente"
    )
    try:
        await asyncio.to_thread(send_email, email, subject, body)
    except Exception:
        logger.warning("Notification envoyée en échec — %s", email, exc_info=True)