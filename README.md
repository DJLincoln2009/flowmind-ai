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

- Web : `pnpm --filter web build` (Next + typecheck)
- API : `uv run pytest -q` · `uv run ruff check app tests`

## Budget

$0/mois — free tiers uniquement (Gemini, Groq, Mistral, OCR.space, Vercel, Fly.io). Voir `docs/PLAN.md`.