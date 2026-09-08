# FlowMind AI

Plateforme SaaS d'automatisation intelligente par IA — interface visuelle drag-and-drop, premium, **local-first**.

## Monorepo

```
apps/web     Next.js 16 (App Router) + React 19 + Tailwind v4 + shadcn/ui (Base UI)
apps/api     FastAPI async + SQLModel + SQLite (aiosqlite) + Alembic
packages/shared  Types Zod partagés (graphe, exécutions, auth)
```

## Démarrage en développement

```powershell
# Frontend
pnpm install
pnpm --filter web dev          # http://localhost:3000

# Backend
cd apps/api
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8000   # http://localhost:8000/docs
```

## Démarrage en Docker

```powershell
docker compose up --build     # API :8000 + Web :3000
```

## Qualité

- Web : `pnpm --filter web lint` · `pnpm --filter web exec tsc --noEmit` · `pnpm --filter web test` (Vitest) · `pnpm --filter web build`
- API : `uv run ruff check app tests` · `uv run python -m pytest -q`
- CI : `.github/workflows/ci.yml` (lint + types + tests + build sur chaque push)

## Déploiement

- Frontend → **Vercel** (free tier)
- Backend → **Railway.app** (crédit initial ~$5, sans carte au premier déploiement — voir `docs/PLAN.md`)
- Déploiements automatiques via **deploy hooks** (`.github/workflows/deploy.yml`) : secrets GitHub `VERCEL_DEPLOY_HOOK` et `RAILWAY_DEPLOY_HOOK`
- En local : `docker compose up --build`
- Détails d'architecture : `docs/ARCHITECTURE.md`

## Budget

$0/mois — free tiers uniquement (Gemini, Groq, Mistral, OCR.space, Vercel, Railway.app). Voir `docs/PLAN.md`.