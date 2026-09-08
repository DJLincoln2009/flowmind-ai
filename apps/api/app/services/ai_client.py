"""Client IA unifié — chaîne de fallback structurée.

Tous les appels IA passent par cette interface. La chaîne est :
  Gemini (primaire) → OpenRouter (fallback 1) → Groq (fallback 2) → Mistral (fallback 3)

Chaque provider parle le protocole OpenAI-compatible (messages → choix[0].message.content).
"""

import json
import logging
from typing import Any, Literal

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

ProviderName = Literal["gemini", "openrouter", "groq", "mistral"]

# ---------- Endpoints ----------

PROVIDER_ENDPOINTS: dict[ProviderName, str] = {
    "gemini": "https://generativelanguage.googleapis.com/v1beta/openai",
    "openrouter": "https://openrouter.ai/api/v1",
    "groq": "https://api.groq.com/openai/v1",
    "mistral": "https://api.mistral.ai/v1",
}

PROVIDER_MODELS: dict[ProviderName, str] = {
    "gemini": "gemini-3.6-flash",
    "openrouter": "nvidia/nemotron-3-ultra-550b-a55b:free",
    "groq": "qwen/qwen3.6-27b",
    "mistral": "mistral-small-latest",
}

PROVIDER_API_KEY_ATTR: dict[ProviderName, str] = {
    "gemini": "gemini_api_key",
    "openrouter": "openrouter_api_key",
    "groq": "groq_api_key",
    "mistral": "mistral_api_key",
}


def _provider_chain(primary: ProviderName | str = "gemini") -> list[ProviderName]:
    """Renvoie la chaîne de providers dans l'ordre de fallback."""
    order: list[ProviderName] = ["gemini", "openrouter", "groq", "mistral"]
    try:
        idx = order.index(primary)  # type: ignore[arg-type]
    except ValueError:
        idx = 0
    return order[idx:] + order[:idx]


class AIClient:
    """Client IA asynchrone avec fallback automatique."""

    def __init__(self, *, timeout: float = 30.0) -> None:
        self._timeout = timeout

    # ---- Appel bas niveau ----

    async def _call_provider(
        self,
        provider: ProviderName,
        messages: list[dict[str, str]],
        *,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        response_format: dict[str, str] | None = None,
    ) -> str:
        """Appel HTTP vers un provider OpenAI-compatible."""
        api_key = getattr(settings, PROVIDER_API_KEY_ATTR[provider], "")
        if not api_key:
            raise ValueError(f"Clé API manquante pour {provider}")

        url = f"{PROVIDER_ENDPOINTS[provider]}/chat/completions"
        payload: dict[str, Any] = {
            "model": PROVIDER_MODELS[provider],
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if response_format:
            payload["response_format"] = response_format

        async with httpx.AsyncClient(timeout=self._timeout) as client:
            resp = await client.post(
                url,
                json=payload,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]

    # ---- Appel avec fallback ----

    async def chat(
        self,
        messages: list[dict[str, str]],
        *,
        temperature: float = 0.7,
        max_tokens: int = 4096,
        response_format: dict[str, str] | None = None,
        primary: ProviderName | str | None = None,
    ) -> tuple[str, ProviderName]:
        """Appel IA avec chaîne de fallback. Renvoie (texte, provider utilisé)."""
        chain = _provider_chain(primary or settings.ai_primary)
        last_err: Exception | None = None

        for provider in chain:
            try:
                text = await self._call_provider(
                    provider,
                    messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                    response_format=response_format,
                )
                logger.info("IA: %s répondu via %s", provider, provider)
                return text, provider
            except Exception as exc:  # noqa: BLE001 — fallback volontaire sur n'importe quelle erreur
                last_err = exc
                logger.warning("IA: %s échoué (%s), tentative suivante…", provider, exc)

        raise RuntimeError(f"Tous les providers IA ont échoué. Dernière erreur : {last_err}")

    # ---- LLM helper ----

    async def llm(
        self,
        prompt: str,
        *,
        system: str = "",
        temperature: float = 0.7,
        max_tokens: int = 4096,
        primary: ProviderName | str | None = None,
    ) -> str:
        """Raccourci : un seul prompt + système optionnel."""
        messages: list[dict[str, str]] = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        text, _ = await self.chat(messages, temperature=temperature, max_tokens=max_tokens, primary=primary)
        return text

    async def llm_json(
        self,
        prompt: str,
        *,
        system: str = "",
        temperature: float = 0.3,
        max_tokens: int = 4096,
        primary: ProviderName | str | None = None,
    ) -> dict[str, Any]:
        """LLM qui renvoie du JSON valide (utilise response_format : json)."""
        text = await self.llm(
            prompt,
            system=system,
            temperature=temperature,
            max_tokens=max_tokens,
            primary=primary,
        )
        # Nettoyage des markdown fences si présents
        clean = text.strip()
        if clean.startswith("```"):
            clean = clean.split("\n", 1)[1] if "\n" in clean else clean[3:]
            clean = clean.removesuffix("```")
        return json.loads(clean.strip())


# Instance singleton partagée
ai_client = AIClient()