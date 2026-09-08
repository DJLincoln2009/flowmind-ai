# FlowMind AI — Plan de Réalisation Premium (2026)

## 1. Objectif

Créer **FlowMind AI**, une plateforme SaaS d'automatisation intelligente par IA avec interface visuelle drag-and-drop, fonctionnant **d'abord en local** puis facilement déployable en production. Le produit doit être **Premium** — au niveau des meilleurs assistants IA (benchmark : Claude Cowork) — avec son propre design system, 100 % gratuit (aucune carte bancaire), utilisant les technologies 2026 les plus récentes.

## 2. Contraintes & Principes

- **Budget : $0/mois** — uniquement des services avec free tier généreux, sans carte bancaire.
- **Local-first** : le produit doit fonctionner en local sur le PC de l'utilisateur, facilement déployable ensuite.
- **Premium partout** : design system propriétaire, micro-interactions, qualité irréprochable.
- **Technologies 2026 actuelles** et éprouvées.
- **Chaque action trackée et commitée** (Git + branches de fonctionnalité).
- Possibilité de **dépasser les limites des documents** originaux pour un meilleur résultat.

## 3. Points des documents à modifier

Le plan reprend `docs/FlowMind_AI.md` et `docs/FlowMind_AI_Rapport_Strategique.md` avec les évolutions suivantes.

### 3.1 — Stack remplacée dans les deux documents

| Point original | Remplacement |
|---|---|
| Celery + Redis pour l'async | Moteur DAG asynchrone natif FastAPI (`asyncio` + `BackgroundTasks`), graduation possible vers BullMQ/Celery |
| PostgreSQL requis | **SQLite local-first** (zero config), swap vers PostgreSQL par simple changement d'URL `DATABASE_URL` |
| Déploiement Render/Fly.io | **Railway.app** (crédit initial ~$5, sans carte au premier déploiement) en production, **Docker Compose** en local |
| Auth JWT simple | **BetterAuth / Lucia Auth** — JWT + OAuth2 (GitHub/Google), refresh tokens |
| IA "Gemini / OpenRouter" vague | **Chaîne de fallback structurée** : Gemini 2.5 Flash → Groq (Llama 3.3) → Mistral Nemo → OpenRouter `:free` |
| OCR "Tesseract" | **OCR.space** (25K req/mo gratuit) en primaire + **Tesseract** en fallback local |
| Transcription non détaillée | **Groq Whisper** (gratuit) + **faster-whisper** CPU en fallback local |
| Plan 3 semaines | Plan **5 semaines** (ajout d'une semaine de polish UI/design system) |
| Pas de design system | Design system propriétaire **dark-first** + tokens sémantiques (voir section 6) |

### 3.2 — Document `FlowMind_AI.md` : sections à réécrire
- Section 5 (Technologies) → tableau à jour avec versions 2026.
- Section 6 (Architecture) → nouvelle architecture complète.
- Section 7 (Déploiement) → Docker Compose + Railway.app + Vercel.
- Section 10 (Plan) → 5 semaines.
- **Ajout** : section "Design System", section "Fonctionnalités Premium".

### 3.3 — Document `FlowMind_AI_Rapport_Strategique.md` : sections à réécrire
- Section 4 (Architecture technique) → complète, moteur DAG async + SSE.
- Section 5 (Stack) → tableau mis à jour.
- Section 6.6 (Roadmap) → 5 semaines.
- Section 7 (Plan MVP) → priorités mises à jour.
- Annexe C (Structure dépôt) → structure monorepo.
- **Ajout** : section "Design System FlowMind".

## 4. Architecture Technique

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND                               │
│  Next.js 16.2+ (App Router, Turbopack)                   │
│  React 19.2 │ TypeScript 5.x                             │
│  shadcn/ui (Base UI primitives) │ Tailwind CSS v4        │
│  @xyflow/react v12 (React Flow) │ Zustand v5             │
│  TanStack Query v5 │ TanStack Table                      │
│  Motion (animations) │ Lucide (icons)                    │
│  Geist Sans + Geist Mono │ next-themes                    │
├──────────────────────────────────────────────────────────┤
│                    BACKEND                               │
│  FastAPI 0.141+ │ Python 3.13+                           │
│  SQLModel + SQLAlchemy 2.0 (async) │ Alembic             │
│  Pydantic v2 │ Uvicorn │ uv (package manager)            │
├──────────────────────────────────────────────────────────┤
│                 WORKFLOW ENGINE                           │
│  DAG Engine (Kahn's topological sort)                    │
│  SSE streaming temps réel │ BackgroundTasks              │
│  Retry policy (exponential backoff) │ State machine      │
├──────────────────────────────────────────────────────────┤
│              AI SERVICES (100% gratuit)                  │
│  Primaire: Gemini 2.5 Flash (1M ctx)                     │
│  Vitesse: Groq (Llama 3.3 70B + Whisper)                 │
│  EU/French: Mistral Nemo (GDPR, natif FR)               │
│  OCR: OCR.space (25K/mo) │ Fallback: Tesseract local    │
│  Classification: HF zero-shot (ModernBERT)               │
│  Interface: OpenAI-compatible SDK (1 ligne de switch)    │
├──────────────────────────────────────────────────────────┤
│              BASE DE DONNÉES                              │
│  Local: SQLite + aiosqlite (zero config)                 │
│  Production: PostgreSQL + asyncpg (swap URL)             │
│  Migrations: Alembic (day 1)                            │
├──────────────────────────────────────────────────────────┤
│              DÉPLOIEMENT                                 │
│  Local: Docker Compose                                   │
│  Frontend prod: Vercel (free tier)                       │
│  Backend prod: Railway.app (crédit initial)                 │
│  CI/CD: GitHub Actions                                   │
│  Monorepo: Turborepo + pnpm                              │
└──────────────────────────────────────────────────────────┘
```

## 5. Structure du Dépôt (Monorepo)

```
flowmind-ai/
├── apps/
│   ├── web/                    # Next.js 16 (App Router)
│   │   ├── app/                # Routes App Router
│   │   │   ├── (auth)/         # Login/Register
│   │   │   ├── (dashboard)/    # Dashboard, Workflows, History
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui (owned)
│   │   │   ├── workflow/       # Canvas, NodePalette, NodeTypes
│   │   │   ├── dashboard/      # KPI cards, activity feed
│   │   │   └── shared/         # Layout, Sidebar, CmdK
│   │   ├── stores/             # Zustand stores (4 domaines)
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Utils, API client
│   │   └── styles/
│   │       └── globals.css     # @theme tokens, dark-first
│   │
│   └── api/                    # FastAPI backend
│       ├── app/
│       │   ├── main.py         # FastAPI app + lifespan
│       │   ├── routes/         # auth, workflows, executions
│       │   ├── models/         # SQLModel models
│       │   ├── schemas/        # Pydantic schemas
│       │   ├── services/       # AI, workflow engine, OCR
│       │   ├── core/           # config, security, deps
│       │   └── migrations/     # Alembic
│       └── tests/
│
├── packages/
│   └── shared/                 # Types Zod partagés client/server
│
├── docker-compose.yml          # Local dev (SQLite ou Postgres)
├── turbo.json
├── pnpm-workspace.yaml
├── .github/workflows/          # CI: lint, typecheck, test
├── docs/                       # Architecture, guide install
└── README.md
```

## 6. Design System Premium "FlowMind"

### 6.1 — Principes
- **Dark-first** : mode sombre = design principal, mode clair dérivé.
- **Monochrome + 1 accent saturé** : gris dé-saturés + violet comme couleur d'action.
- **4 niveaux d'élévation** sans ombres (dark) : `base → raised → overlay → menu`.
- **Tokens sémantiques** : jamais de hex brut dans les composants.
- **Glassmorphism** : réservé aux panneaux flottants du canvas (max 3 surfaces).
- **Typographie** : Geist Sans (UI) + Geist Mono (code/data) via `next/font`.
- **Animations** : Motion (LazyMotion), 150–250 ms easings, subtle > flashy.
- **Cmd+K** partout (command palette).
- **Skeleton screens** pour chaque état de chargement.

### 6.2 — Palette Dark-First (base)

```
surface-base:     #0E0E12    (fond principal)
surface-raised:   #18181F    (cartes, sidebar)
surface-overlay:  #222229    (modals, dropdowns)
surface-menu:     #2A2A33    (menus, popovers)
text-primary:     #EDEDEF    (90% white, pas pur)
text-secondary:   #8B8B93    (texte secondaire)
border:           #2E2E36    (bordures subtiles)
accent:           #6C5CE7    (violet — action principale)
accent-hover:     #7C6EF7
success:          #2ECC71    (exécution réussie)
error:            #E74C3C    (erreur)
warning:          #F39C12    (attention)
```

## 7. Fonctionnalités Premium (au-delà des documents)

### 7.1 — Inspired par Claude Cowork
1. **Agentic execution** : décrire un objectif, l'IA planifie et exécute.
2. **Activity feed temps réel** (SSE) : voir chaque nœud s'exécuter en direct.
3. **Command Palette (Cmd+K)** : navigation/execution rapide.
4. **Scheduled workflows** : cron-like, exécution sans être connecté.
5. **AI-native components** : résumé/task extraction comme composants premiers.
6. **Plugin system** : nouveaux types de nœuds via configuration.
7. **Templates marketplace** : workflows prêts à l'emploi.

### 7.2 — Spécifiques FlowMind
- **Workspace intelligent** : dossiers, tags, recherche full-text.
- **Version history** : undo/redo sur le canvas (snapshots Zustand).
- **Multi-language** : français par défaut, anglais toggle.
- **PWA** : installation locale, notifications push.
- **Responsive** : usable sur tablette (builder = desktop).

## 8. Plan de Développement (5 Semaines)

### Semaine 1 — Fondations
- Init monorepo (Turborepo + pnpm + Next.js + FastAPI)
- Setup shadcn/ui + Tailwind v4 + tokens dark-first + Geist
- FastAPI app + SQLModel + SQLite + Alembic
- Auth (BetterAuth/Lucia — JWT + OAuth2)
- API CRUD workflows
- **Commit initial**

### Semaine 2 — Workflow Builder Core
- React Flow v12 canvas avec custom nodes
- Node palette drag-and-drop
- Save/load workflows (JSON → API → SQLite)
- Zustand stores (4 domaines)
- Command Palette (Cmd+K)
- Sidebar navigation premium

### Semaine 3 — Workflow Engine + AI
- DAG Engine (topological sort + levels)
- SSE streaming temps réel
- Intégration IA structurée (Gemini → Groq → Mistral)
- Blocs IA : Résumé, Extraction, Classification, OCR
- Transcription vocale (Groq Whisper)
- State machine des exécutions

### Semaine 4 — Dashboard + Polish UI
- Dashboard KPI (workflows actifs, exécutions, taux succès, durée moyenne)
- Historique des exécutions (TanStack Table)
- Activity feed temps réel
- Notifications (Sonner + email)
- Empty states, loading skeletons, error boundaries
- Dark/Light toggle, responsive

### Semaine 5 — Finalisation + Deploy
- Templates de workflows (5–6)
- Scheduled workflows (cron)
- Docker Compose local
- CI/CD GitHub Actions
- Documentation (README, ARCHITECTURE.md)
- Tests (pytest, Vitest)
- Déploiement production (Vercel + Railway.app)
- Vidéo démo

## 9. Budget : $0/mois

| Service | Tier | Carte requise ? |
|---|---|---|
| Vercel (frontend) | Free (250 builds/mo) | Non |
| Railway.app (backend) | Crédit initial ~$5 (sans carte au premier déploiement) | Au-delà du crédit : carte requise → Vérifier le free tier à l'inscription |
| Gemini API | Free (10 RPM, 250 req/day) | Non |
| Groq | Free (30 RPM, 1K req/day) | Non |
| Mistral | Free rate-limited | Non |
| OCR.space | Free (25K/mo) | Non |
| HuggingFace | Free (hundreds req/hr) | Non |
| SQLite | Local (infini) | Non |
| GitHub | Free (repos illimités) | Non |

## 10. Gestion Git

- `main` : toujours stable et déployable.
- `develop` : intégration en cours.
- Branches de fonctionnalité : `feature/<name>` fusionnées via PR auto-revue.
- Tags de version : `v0.1`, `v0.2`, etc.
- Chaque action de dev → commit avec message clair incluant le numéro de tâche du suivi.
