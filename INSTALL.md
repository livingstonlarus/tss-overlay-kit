# Installation Guide

## Prerequisites

- **Node.js** ≥ 20.x
- **pnpm** ≥ 9.x
- **PostgreSQL** (Neon or local)

## Setup

```bash
# Clone the repository
git clone <repo-url>
cd <project-name>

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
```

## Environment Variables

Edit `.env` with your credentials:

```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
BETTER_AUTH_SECRET=<random-secret>
RESEND_API_KEY=re_xxxx
STRIPE_SECRET_KEY=sk_xxxx
GOCARDLESS_ACCESS_TOKEN=<token>
GOOGLE_ADS_CUSTOMER_ID=123-456-7890
```

## Database

```bash
# Push schema to database
pnpm drizzle-kit push

# Generate migrations (optional)
pnpm drizzle-kit generate
```

## i18n

Translations live in `messages/`. The default locale is `en`. To add a locale:

1. Add the locale code to `project.inlang/settings.json` → `locales`
2. Create `messages/<locale>.json`
3. Run `pnpm dev` — Paraglide auto-generates the runtime

## Development

```bash
pnpm dev          # Start dev server (port 3000)
pnpm build        # Production build
pnpm typecheck    # Type checking
pnpm lint         # Lint
```

## Adapting for Your Project

1. Update `name` in `package.json`
2. Update `name` in `ecosystem.config.cjs`
3. Update `short_name` and `name` in `public/manifest.json`
4. Set your port in `ecosystem.config.cjs` and `package.json` scripts
5. Replace favicons in `public/`
6. Add your schema to `src/server/schema.ts`
