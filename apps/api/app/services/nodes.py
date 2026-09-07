"""Handlers pour chaque type de nœud du workflow.

Chaque handler reçoit le contexte d'exécution (node_data + résultats des prérequis)
et renvoie un dict qui sera stocké dans node_states[node_id].
"""

from __future__ import annotations

import io
import logging
from typing import Any

import httpx

from app.core.config import settings
from app.services.ai_client import ai_client

logger = logging.getLogger(__name__)

# ---------- Types de handler ----------

NodeHandler = Any  # Callable[[dict, dict[str, Any]], Awaitable[dict]]


# ---------- Résumé IA ----------

async def handle_ai_summary(data: dict, inputs: dict[str, Any]) -> dict:
    text = inputs.get("text", "")
    prompt = f"Résumez le texte suivant en quelques lignes claires et concises :\n\n{text[:8000]}"
    result = await ai_client.llm(prompt, system="Vous êtes un assistant de résumé spécialisé.")
    return {"summary": result, "provider": "ai"}


# ---------- Extraction IA ----------

async def handle_ai_extract(data: dict, inputs: dict[str, Any]) -> dict:
    text = inputs.get("text", "")
    fields = data.get("fields", "nom, email, date")
    prompt = (
        f"Extrayez les informations suivantes du texte : {fields}\n\n"
        f"Texte :\n{text[:8000]}\n\n"
        f"Répondez en JSON valide avec une clé par champ demandé."
    )
    result = await ai_client.llm_json(prompt, system="Vous êtes un extracteur d'information.")
    return {"extracted": result, "provider": "ai"}


# ---------- Classification IA ----------

async def handle_ai_classify(data: dict, inputs: dict[str, Any]) -> dict:
    text = inputs.get("text", "")
    categories = data.get("categories", "positive, négatif, neutre")
    prompt = (
        f"Classez le texte suivant dans une de ces catégories : {categories}\n\n"
        f"Texte :\n{text[:8000]}\n\n"
        f"Répondez en JSON : {{\"category\": \"...\", \"confidence\": 0.95}}"
    )
    result = await ai_client.llm_json(prompt, system="Vous êtes un classificateur de texte.")
    return {"classification": result, "provider": "ai"}


# ---------- OCR (OCR.space primaire + Tesseract fallback) ----------

async def handle_ocr(data: dict, inputs: dict[str, Any]) -> dict:
    image_url = data.get("image_url", "")
    if not image_url:
        return {"text": "", "error": "Aucune URL d'image fournie"}

    # OCR.space (primaire, 25K req/mo gratuit)
    api_key = settings.ocrspace_api_key
    if api_key:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    "https://api.ocr.space/parse/imageurl",
                    data={"apikey": api_key, "url": image_url, "language": "fra"},
                )
                resp.raise_for_status()
                result = resp.json()
                parsed = result.get("ParsedResults", [{}])[0]
                return {"text": parsed.get("ParsedText", ""), "provider": "ocrspace"}
        except Exception as exc:  # noqa: BLE001 — fallback OCR volontaire
            logger.warning("OCR.space échoué : %s", exc)

    # Tesseract (fallback local — non disponible en Windows sans binary)
    return {"text": "", "error": "OCR non disponible (clé OCR.space manquante ou échouée)"}


# ---------- Transcription vocale (Groq Whisper) ----------

async def handle_transcription(data: dict, inputs: dict[str, Any]) -> dict:
    audio_url = data.get("audio_url", "")
    if not audio_url:
        return {"text": "", "error": "Aucune URL audio fournie"}

    groq_key = settings.groq_api_key
    if not groq_key:
        return {"text": "", "error": "Clé Groq manquante"}

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            # Télécharger l'audio
            audio_resp = await client.get(audio_url)
            audio_resp.raise_for_status()
            audio_bytes = io.BytesIO(audio_resp.content)
            audio_bytes.name = "audio.wav"

            resp = await client.post(
                "https://api.groq.com/openai/v1/audio/transcriptions",
                headers={"Authorization": f"Bearer {groq_key}"},
                files={"file": ("audio.wav", audio_bytes, "audio/wav")},
                data={"model": "whisper-large-v3-turbo", "language": "fr"},
            )
            resp.raise_for_status()
            return {"text": resp.json().get("text", ""), "provider": "groq_whisper"}
    except Exception as exc:  # noqa: BLE001 — fallback volontaire
        logger.warning("Groq Whisper échoué : %s", exc)
        return {"text": "", "error": str(exc)}


# ---------- Requête HTTP ----------

async def handle_http_request(data: dict, inputs: dict[str, Any]) -> dict:
    url = data.get("url", "")
    method = data.get("method", "GET").upper()
    if not url:
        return {"status": 0, "body": "", "error": "URL manquante"}

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.request(method, url)
            return {
                "status": resp.status_code,
                "body": resp.text[:5000],
                "provider": "http",
            }
    except Exception as exc:  # noqa: BLE001 — un nœud HTTP ne jamais casser le workflow
        return {"status": 0, "body": "", "error": str(exc)}


# ---------- Délai ----------

async def handle_delay(data: dict, inputs: dict[str, Any]) -> dict:
    import asyncio
    seconds = min(int(data.get("seconds", 0)), 300)
    if seconds > 0:
        await asyncio.sleep(seconds)
    return {"waited": seconds}


# ---------- Trigger ----------

async def handle_trigger(data: dict, inputs: dict[str, Any]) -> dict:
    # Le déclencheur expose son payload (data) comme entrée des nœuds suivants.
    payload = {k: v for k, v in data.items() if k != "label"}
    return {"triggered": True, "mode": data.get("mode", "manual"), **payload}


# ---------- Condition ----------

async def handle_condition(data: dict, inputs: dict[str, Any]) -> dict:
    expr = data.get("expression", "")
    # Évaluation simplifiée : si expression non vide, on passe
    result = bool(expr)
    return {"passed": result, "expression": expr}


# ---------- Sortie ----------

async def handle_output(data: dict, inputs: dict[str, Any]) -> dict:
    return {"output": inputs.get("text", inputs.get("summary", ""))}


# ---------- Dispatch ----------

HANDLERS: dict[str, NodeHandler] = {
    "trigger": handle_trigger,
    "condition": handle_condition,
    "ai_summary": handle_ai_summary,
    "ai_extract": handle_ai_extract,
    "ai_classify": handle_ai_classify,
    "ocr": handle_ocr,
    "transcription": handle_transcription,
    "http_request": handle_http_request,
    "delay": handle_delay,
    "output": handle_output,
}


async def execute_node(node_type: str, node_data: dict, inputs: dict[str, Any]) -> dict:
    handler = HANDLERS.get(node_type)
    if not handler:
        return {"error": f"Type de nœud inconnu : {node_type}"}
    return await handler(node_data, inputs)