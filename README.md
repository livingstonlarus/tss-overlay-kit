# Project Name

> One-line description of what this application does.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | TanStack Start (SolidJS) |
| Styling | Tailwind CSS v3 (PostCSS) |
| Database | Drizzle ORM + Postgres.js |
| Auth | Better Auth |
| Payments | Stripe + GoCardless |
| Email | Resend |
| i18n | Paraglide (22 SEPA locales) |
| UI | Kobalte (headless) |
| Runtime | Node.js + PM2 (OpenBSD) |

## Quick Start

```bash
pnpm install
cp .env.example .env   # Fill in credentials
pnpm dev
```

## Directory Structure

```
src/
├── routes/          # File-based routing
├── server/          # Server functions (db, auth, payments, email)
├── components/      # UI components
├── lib/             # Utilities & i18n
├── paraglide/       # Generated i18n (auto)
└── app.css          # Tailwind entry + CSS variables
public/              # Static assets, manifest, favicon
docs/                # Engineering standards (DE-002, DE-004)
```

## Standards

- **DE-002** — Engineering Standard
- **DE-004** — Visual Identity System

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm typecheck` | Type checking |
| `pnpm lint` | Linting |
