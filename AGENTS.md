# AGENTS.md — FlowMind AI

## État du repo
- **Fondations posées, code non commencé** : `docs/` (plan + suivi), config `opencode.json`, skills installés et commits git sur la branche `main`. Le travail d'implémentation (monorepo) n'a pas commencé.
- **Sources de vérité** : `docs/PLAN.md` (architecture et stack prévues) et `docs/PLAN_SUIVI.md` (suivi des tâches). Toute implémentation doit être conforme au plan ; les documents originaux (`docs/FlowMind_AI.md`, `docs/FlowMind_AI_Rapport_Strategique.md`) sont les specs produit de référence et doivent être mis à jour si le produit évolue.

## Règles de travail (contraintes du projet, non négociables)
- **Chaque action de développement doit être trackée ET commitée** : remplir la ligne correspondante dans `docs/PLAN_SUIVI.md` (statut, date, branche, commit) après chaque tâche, puis commiter.
- **Budget $0/mois** : uniquement des services à free tier, AUCUNE carte bancaire. Si un choix technologique exige un paiement, le remplacer.
- **Local-first** : doit tourner en local sur Windows (PowerShell 5.1 shell) avant tout déploiement. Langage de travail : **français** (docs, commits et communication en français).

## Architecture cible (prévue par PLAN.md — à construire)
- Monorepo **Turborepo + pnpm** : `apps/web` + `apps/api` + `packages/shared` (types Zod partagés).
- `apps/web` : Next.js 16 (App Router), React 19, shadcn/ui (primitives **Base UI**, pas Radix), Tailwind CSS v4 (config CSS-first via `@theme` dans `globals.css`, tokens **dark-first**), `@xyflow/react` v12, Zustand v5, TanStack Query/Table, Motion, Lucide, fonts Geist.
- `apps/api` : FastAPI (async), SQLModel + SQLAlchemy 2.0 async, **SQLite via aiosqlite en local** (swap vers PostgreSQL = changement d'URL `DATABASE_URL` uniquement), Alembic dès le jour 1, gestion de paquets **uv**, lint/format **Ruff**, tests **pytest + httpx**.
- Moteur de workflows : DAG natif FastAPI (tri topologique de Kahn + niveaux parallèles), statut par nœud, streaming **SSE** vers le canvas. Pas de Celery/Redis au MVP.
- IA : chaîne de fallback structurée (Gemini 2.5 Flash → Groq Llama 3.3/Whisper → Mistral Nemo), clients tous compatibles OpenAI, module d'abstraction avec un seul point de bascule.
- Déploiement : Vercel (frontend) + Railway.app (backend, crédit initial sans carte bancaire), Docker Compose en local.

## Conventions Git
- `main` toujours stable/déployable ; intégration sur `develop` ; branches `feature/<name>` fusionnées via PR auto-revue ; tags `v0.x` à chaque jalon.

## Chargement des skills (discipline contexte)
- **Ne jamais charger un skill par anticipation** : invoquer l'outil `skill` uniquement au moment précis où son contenu va être utilisé, jamais "au cas où" ou en début de session.
- **Une fois la tâche du skill terminée, le décharger** : ne plus le citer ni le re-invoquer pour les tâches suivantes ; laisser `compaction.auto` (config `opencode.json`) purger le contenu injecté. Pour les longues sessions, préférer une session fraîche à l'accumulation de skills résiduels.
- Ne pas charger plusieurs skills si un seul suffit ; en cas d'ambiguïté, privilégier le skill le plus spécifique.

## Points de vigilance (pièges planifiés)
- **Ne pas commencer par créer du code hors sujet** : suivre l'ordre des semaines dans `docs/PLAN_SUIVI.md` (Semaine 1 = fondations du monorepo).
- les docs de spécs utilisent du markdown au format texte brut avec `\*\*` (escaping) ; ne pas re-générer ce format, préférer les tableaux pour PLAN_SUIVI.
- OCR : OCR.space (25K req/mo) en primaire, Tesseract en fallback local ; transcription : Groq Whisper en primaire, faster-whisper CPU en fallback.