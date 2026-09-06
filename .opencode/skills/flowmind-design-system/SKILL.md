---
name: flowmind-design-system
description: Applies the FlowMind AI premium design system — dark-first fully-owned tokens, Geist typography, elevation ladder, glassmorphism limits and premium micro-interactions. Use when creating, theming, or reviewing any UI component, page, layout, animation or style in apps/web. Ensures the product never reads as templated or generic.
license: Compte tenu dans le repo FlowMind AI
---

# FlowMind AI — Design System Premium (dark-first)

Requis non négociables : le produit doit être **Premium** (benchmark : Linear, Vercel, Stripe, Claude Cowork) et **non générique**. Chaque choix visuel doit être délibéré, pas un défaut. Suivre ce document avant d'écrire le moindre CSS.

## 1. Palette (tokens dans `globals.css` via `@theme`)

Couleurs de base nominatives, jamais de hex brut dans les composants (utiliser les classes `bg-surface-*`, `text-*`, `border-*` sémantiques) :

```
surface-base    #0E0E12   fond principal (mode sombre par défaut)
surface-raised  #18181F   cartes, sidebar, panneaux flottants
surface-overlay #222229   modals, dropdowns, popovers
surface-menu    #2A2A33   menus contextuels, autocomplete
text-primary    #EDEDEF   ~90 % blanc, jamais 100 %
text-secondary  #8B8B93   labels, descriptions, métadonnées
text-muted      #6A6A72   contenus très secondaires, placeholder
border          #2E2E36   bordures 1px subtiles
accent          #6C5CE7   violet — unique couleur saturée, réservée à l'action principale
accent-hover    #7C6EF7
success         #34D399   statut OK / exécution réussie
error           #F87171   erreurs, échecs
warning         #FBBF24   avertissements
info            #60A5FA   informations
```

Règles :
- **Monochrome + 1 accent saturé** (`accent`). Toute autre couleur = uniquement sémantique (succès/erreur/alerte).
- **Jamais de noir pur** (#000) ni de fonds "tinté presque noir" arbitraires.
- Le mode clair est **dérivé** du sombre (inversion contrôlée de la luminance des mêmes tokens sémantiques), jamais redessiné séparément.

## 2. Élévation (sombre = élévation par luminance, pas d'ombres)

Les ombres ne fonctionnent pas en dark mode. Séparer les surfaces par luminosité croissante :
`base → raised → overlay → menu` (+3 à +8 % de luminance à chaque niveau). Utiliser des ombres uniquement en mode clair et de façon discrète (`shadow-sm`).

## 3. Typographie (Geist via `next/font`)

- **Geist Sans** : interface, titres, corps. Intervalles `font-medium`/`semibold` pour les titres, `normal` pour le corps.
- **Geist Mono** : code, IDs, journaux d'exécution, variables de conditions, nombres dans les KPI (chiffres tabulaires).
- Corps : 14–16px ; line-height ≥ 1.5 ; **aucun** texte de contenu < 13px.
- Échelle cohérente (pas de tailles arbitraires). Grands titres de page : un seul niveau visuel fort, le reste reste discret.
- Interdire les signatures "template généré" : un seul mot en accent dans un titre, LIEGENDS all-caps, étiquettes redondantes au-dessus du contenu, séparateurs `·`, flèches `→` décoratives sur tout lien, fond crème + serif terracotta.

## 4. Surfaces & layout

- **Canvas workflow** : fond `surface-base` avec un léger dégradé radial subtil pour donner de la profondeur ; **uniquement lui** peut être glassmorphism (`backdrop-blur` max 3 surfaces simultanées, toujours avec un fallback opaque).
- **Données** (tables hiérarchie d'exécution, formulaires, inspecteur JSON) : surfaces **opaques** — jamais de blur sur les tables (pertes de lisibilité et perf).
- Cartes : séparées par élévation, pas par bordures/ombres.
- Espace 4/8px ; padding généreux ; bordures 1px `border` seulement quand nécessaire.

## 5. Composants & état

- Chaque composant a **3 états conçus** : chargement (squelette, jamais de spinner seul), vide (invitation à agir, pas de zéro froid), erreur (explicite : quoi s'est mal passé + comment corriger, sans excuses).
- Statuts (pending → running → success/error) : pastilles couleur + icône + label texte (jamais couleur seule).
- Radius : cohérent mais hiérarchisé (petit pour les chips/inline, moyen pour les cartes, grand pour les modals).
- Icônes Lucide uniquement, `strokeWidth` hiérarchisé (2.25 actions, 1.5 décoratif).

## 6. Motion (auto-polaire premium)

- Durées **150–250ms**, easings calmes; **subtile > flashy**. Pas d'entrées fade+slide sur chaque section.
- Animer **préférentiellement `transform`/`opacity`** (compositeur GPU) ; jamais `left/top/width/height` bruts.
- Motion dédiée aux réponses aux actions (ouverture de panneau, confirmation, changement de statut de nœud) et à un moment court et mémorable à l'arrivée sur le dashboard.
- `LazyMotion` + `m` pour limiter le bundle. Toujours respecter `prefers-reduced-motion`.
- Ne jamais animer les lignes de grands tableaux.

## 7. Guide du workflow builder (apps/web)

- Nodes custom React Flow = composants **mémorisés hors du corps parent** (`React.memo`), types via `NodeProps<Node<Data, "type">>`.
- Ne jamais lire `nodes`/`edges` dans les composants de node : `useStore` sélecteurs ou `updateNodeData` pour les mises à jour chirurgicales.
- Stores Zustand séparés par domaine : `workflowStore` (graphe), `executionStore` (statuts par node, logs), `uiStore` (panneaux, sélection), `settingsStore` (préférences, clés API).
- Palette de nœuds : drag-and-drop natif + `screenToFlowPosition()` ; contrôles internes avec `nodrag`/`nopan`.
- Statut d'exécution par nœud synchronisé depuis les événements SSE de l'API.

## 8. Checklist avant de livrer une UI

- Tokens sémantiques partout (pas de hex en dur) ; contraste WCAG 2.2 ≥ 4.5:1
- Dark mode = élégant par défaut ; light mode dérivé fonctionne
- Les 3 états (loading/empty/error) sont désignés
- Aucune signature "template AI" (voir §3)
- Focus clavier visible ; `prefers-reduced-motion` respectée
- Responsive : tableau de bord/lisible jusqu'à 768px, builder usable sur desktop