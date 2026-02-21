# Cetra - Crypto Automation Platform

## Overview

Cetra is a crypto automation platform with a SaaS landing page and full dashboard. It's a full-stack TypeScript application with a React frontend and Express backend. The site features a dark blue futuristic UI with smooth scroll animations, glassmorphism accents, and a lead capture (email waitlist) system backed by PostgreSQL. The product includes a visual drag-and-drop workflow builder and a monitoring dashboard for managing automated crypto workflows.

## Recent Changes

- **Authentication System** (Feb 2026): Full signup/login system with bcrypt password hashing, express-session with connect-pg-simple (PostgreSQL session store), rate-limited auth endpoints. Users table with email/passwordHash/plan/credits/referrals/language. AuthProvider context with useAuth hook. Protected dashboard routes redirect to /login. Sign Up page with validation (email format, password min 8 chars, confirm match, terms checkbox). Google auth placeholder modal. Logout clears session.
- **Multi-Language Support (i18n)** (Feb 2026): Full i18n infrastructure with 6 languages (en/ru/ua/es/kr/fr). Translation files in `client/src/i18n/`, I18nContext with `t()` function and `useI18n` hook, localStorage persistence, English fallback. Language selector dropdown in DashboardLayout sidebar (desktop + mobile). All dashboard pages internationalized.
- **Account Groups** (Feb 2026): Client-side account group management with GroupsContext (localStorage persistence). 400 numbered accounts (Account #1 to Account #400) generated programmatically. Account Groups page at `/dashboard/groups` with create/rename/delete groups, group cards with stats, checkbox-based multi-select account assignment. Group Detail page at `/dashboard/groups/:id` with overview stats, bulk add/remove via checkboxes, recent executions. Group selector integrated into WorkflowBuilder node config.
- **Dashboard Group System** (Feb 2026): Group-based batch execution display (renamed from "tranche" system). Each group card shows batch name (Group #1, #2, etc.), account count, 3-state status badge (Success/Partial/Failed), timestamp, workflow. Expandable details with summary bar (success/failed/pending + animated progress bar), failed account list with error step and hover tooltip for full error log, per-account and per-group retry buttons. Filtering by All/Success/Partial/Failed. Animated counter stat cards for Total Accounts/Successful/Failed. Activity feed with recent events. Accounts displayed as numbered (Account #N) instead of wallet addresses.
- **Workflow Builder** (Feb 2026): Full visual workflow builder at /dashboard/workflows with drag-and-drop node canvas, 8 node types, connection system with curved SVG paths, zoom/pan controls, simulation mode, undo/redo, JSON export/import.
- **Template-Driven Builder** (Feb 2026): JSON-config driven template system at `client/src/data/workflowTemplates.ts`. Multi-step flow: Library → Category Selection → Project Selection → Builder. 4 categories (Social Activity, Testnet, Airdrop [coming soon], Farming [coming soon]). 10 preconfigured project templates (5 per available category): Social (Konnex, Zealy, Galxe, Twitter Engagement, Discord Role Farming) and Testnet (Pharos, LayerZero, Starknet, Scroll, Base). Template engine auto-generates nodes/connections from block configs. Save as Custom Template stores to localStorage. TemplateSelection component at `client/src/components/TemplateSelection.tsx`. Scalable to 100+ templates without core builder changes.
- **Theme Switcher (Dark/Light Mode)** (Feb 2026): ThemeContext at `client/src/contexts/ThemeContext.tsx` with ThemeProvider. System preference detection via `prefers-color-scheme`, localStorage persistence (key: "theme"), `data-theme` attribute on `<html>`. Toggle in DashboardLayout sidebar below language selector (both desktop and mobile). Light mode CSS variables in `index.css` under `[data-theme="light"]` with overrides for hardcoded dark colors. Scoped transitions (0.2s) on major containers, disabled on canvas/SVG. i18n keys for theme.light/theme.dark across all 6 languages. Default: dark.
- **Mandatory Guided Onboarding** (Feb 2026): Centralized OnboardingContext at `client/src/contexts/OnboardingContext.tsx` with phase state machine (dashboard → builder → card → completed). localStorage persistence (key: "onboardingPhase"). Phase controls: `advanceToBuilder()`, `advanceToCard()`, `completeOnboarding()`. Sidebar locking during dashboard phase (only Workflow Builder clickable, with animated pulse/glow highlight). Auto-loads first template (Konnex) during builder phase. Builder tour → Card Settings tour sequential flow. Auto-selects first node for card phase. Completion celebration popup. Interaction locking flags: `allowSidebarNav`, `allowCanvasInteraction`, `allowCardDrag`, `allowEdgeCreation`. i18n keys for all 6 languages. New users start at "dashboard" phase; returning users resume from stored phase.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) — single page app with `Home` and `NotFound` routes
- **Styling**: Tailwind CSS with CSS variables for theming, using a dark blue premium color scheme. shadcn/ui component library (new-york style) provides all UI primitives via Radix UI
- **Animations**: Framer Motion for scroll-triggered reveal animations (fade, slide from top/right)
- **State/Data**: TanStack React Query for server state management, React Hook Form with Zod resolvers for form validation
- **Fonts**: Inter (body), Outfit (display/headings), JetBrains Mono (monospace)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express 5 on Node.js with TypeScript (run via `tsx`)
- **API Design**: REST API with a shared route/schema contract in `shared/routes.ts`. The `api` object defines method, path, input schema (Zod), and response schemas — used by both server and client
- **Current endpoints**:
  - `POST /api/signup` — register new user (rate-limited)
  - `POST /api/login` — authenticate user (rate-limited)
  - `POST /api/logout` — destroy session
  - `GET /api/me` — get current authenticated user (protected)
  - `POST /api/leads` — captures email for waitlist signup
- **Dev server**: Vite dev server is used as middleware in development (HMR via `server/vite.ts`). In production, static files are served from `dist/public`

### Shared Layer (`shared/`)
- **Schema** (`shared/schema.ts`): Drizzle ORM table definitions and Zod schemas via `drizzle-zod`. Tables: `leads` (id, email, created_at), `users` (id, email, passwordHash, plan, credits, referrals, language, createdAt)
- **Routes** (`shared/routes.ts`): Typed API contract used by both frontend and backend for type-safe requests and validation

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Driver**: `pg` (node-postgres) with connection pooling
- **Connection**: Requires `DATABASE_URL` environment variable
- **Schema management**: `drizzle-kit push` (`npm run db:push`) to sync schema to database
- **Migrations**: Output to `./migrations` directory

### Build System
- **Development**: `tsx server/index.ts` runs the server with Vite middleware for HMR
- **Production build**: Custom build script (`script/build.ts`) that runs Vite build for frontend and esbuild for server, outputting to `dist/`. Server deps from an allowlist are bundled to reduce cold start times
- **Output**: Frontend → `dist/public`, Server → `dist/index.cjs`

### Key Design Decisions
1. **Shared schema contract**: Zod schemas defined once in `shared/` are used for both client-side form validation and server-side request validation, ensuring type safety across the stack
2. **Authentication**: Full auth system with bcrypt password hashing, PostgreSQL session store (connect-pg-simple), rate-limited signup/login, AuthProvider context with useAuth hook, protected dashboard routes
3. **Component library**: Full shadcn/ui installation with extensive Radix UI primitives available for building new UI features
4. **Single-page landing**: Currently only one page (`Home`) with sections for hero, features, how-it-works, FAQ, and footer — all with scroll animations

## External Dependencies

### Database
- **PostgreSQL**: Required via `DATABASE_URL` environment variable. Used for lead storage via Drizzle ORM

### Key NPM Packages
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, TanStack React Query, Wouter, React Hook Form, shadcn/ui (Radix UI primitives)
- **Backend**: Express 5, Drizzle ORM, `pg` (node-postgres), `connect-pg-simple` (session store, available but not actively used), Zod
- **Build tools**: esbuild (server bundling), tsx (TypeScript execution), drizzle-kit (schema management)

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal` — runtime error overlay in dev
- `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-dev-banner` — dev-only Replit integrations

### External Services
- **Google Fonts**: Inter, Outfit, JetBrains Mono loaded via CDN in `index.html` and `index.css`
- No other external APIs or third-party services are currently integrated (social links in footer are placeholder `#` hrefs)