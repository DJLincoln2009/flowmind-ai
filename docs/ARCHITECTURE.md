# Architecture — FlowMind AI

## Vue d'ensemble

Monorepo **Turborepo + pnpm** :
- `apps/web` — Next.js 16 (App Router), React 19, Tailwind CSS v4 (tokens dark-first), @xyflow/react v12, Zustand v5, TanStack Query/Table, Sonner, next-themes.
- `apps/api` — FastAPI async, SQLModel + SQLAlchemy 2.0 async, SQLite/aiosqlite (swap PostgreSQL = changement d'URL), Alembic, uv, Ruff, pytest.
- `packages/shared` — schémas Zod partagés (graphe, exécutions, statistiques, modèles).

```
apps/web ──┬──REST /api (auth, workflows, stats, historique)──> apps/api
           └──SSE /api/executions/{id}/stream?token=... (temps réel canvas)
```

## Moteur de workflows (DAG)

1. `POST /api/workflows/{id}/run` — crée une `Execution` (`pending`).
2. Le client ouvre le flux **SSE** `/api/executions/{id}/stream` (token Bearer **ou** query `token` car `EventSource` ne permet pas d'headers).
3. `services/executor.run_workflow()` — générateur :
   - **DAG** construit par tri topologique de Kahn + niveaux parallèles (`services/dag.py`).
   - Les nœuds d'un même niveau tournent en **parallèle** (`asyncio.gather`).
   - Événements push : `start` → `node` (statut + output par nœud) → `end`.
   - **Chaque événement est commité en base** (statut par nœud), puis statut final (`success`/`error`).
   - Un nœud en erreur ne casse jamais le workflow (handlers “safe”, `# noqa: BLE001` volontaires).
4. `services/nodes.py` — dispatch des handlers par type de nœud (trigger, ai_*, ocr, transcription, http_request, delay, condition, output).

> ⚠️ Le statut final n'est écrit **en base que si le stream est consommé jusqu'au `end`**. L'exécution planifiée consomme elle-même le générateur (voir Planification).

## Planification cron

- Colonnes `Workflow.cron` (expression 5 champs) + `Workflow.next_run_at`.
- `services/scheduler.scheduler_loop()` — tâche asyncio au lifespan : scrutation toutes les 15 s, exécution des workflows actifs avec `next_run_at <= now`, recalcul via `croniter`.
- Validation de l'expression côté API (`400` si invalide) ; `croniter` recalcule `next_run_at`.
- `run_workflow` est consommé **côté serveur** (aucun client connecté requis).

## Chaîne de fallback IA

`services/ai_client.py` (interface OpenAI-compatible) :
`Gemini 2.5 Flash → Groq (Llama) → OpenRouter :free → Mistral Nemo`. Un seul point de bascule : `FLOWMIND_AI_PRIMARY`. *Les modèles effectifs 2026 sont diagnostiqués en direct et documentés dans PLAN_SUIVI (ajustement du 07-09).*

- OCR : OCR.space (25K req/mo) + Tesseract fallback local
- Transcription : Groq Whisper + faster-whisper CPU fallback

## Notifications

`services/notifier.py` — email SMTP **best-effort** (stdlib), no-op si `FLOWMIND_SMTP_HOST` absent. Notifications UI via **Sonner** (lancée/succès/échec/erreur SSE).

## Templates

`services/templates.py` — 6 graphes préconstruits (nodes/edges valides) exposés publiquement par `GET /api/templates`. La page web `/templates` les instancie d'un clic (`POST /api/workflows`).

## Auth & sécurité

- JWT access + refresh (pyjwt, argon2), `api-security-best-practices` appliqué.
- CORS restreint (`FLOWMIND_CORS_ORIGINS`), tokens jamais commités (`.env` gitignoré).
- SSE authentifié par token (Bearers ou query) — compromis local-first documenté.

## Déploiement

- **Local** : `docker compose up --build` (API :8000 healthcheck `/health`, Web :3000).
- **Vercel** (web) + **Railway.app** (api, `apps/api/railway.toml` + Dockerfile uv).
- **CI/CD** GitHub Actions : `ci.yml` (ruff/pytest + eslint/tsc/vitest/build) et `deploy.yml` (deploy hooks POST via secrets `VERCEL_DEPLOY_HOOK` / `RAILWAY_DEPLOY_HOOK`).
- **Budget** : $0/mois — Railway apporte un crédit initial ~$5 sans carte au premier déploiement ; au-delà, une carte devient nécessaire (voir `docs/PLAN.md` § 9).

## Tests

- API : pytest + httpx (auth, CRUD, stats/historique, templates, cron) — `uv run python -m pytest`.
- Web : Vitest (unitaires purs dans `lib/`, ex. `format.ts`) — `pnpm --filter web test`.
- E2E : scripts Playwright ad hoc (venv API) — dashboards, builder, SSE, thème, responsive (0 erreur console).