# INSTALL — TSS Overlay Kit

## Prerequisites

- **Node.js** v22+ (LTS)
- **pnpm** v10+
- **PostgreSQL** (Neon or local)

## Environment Setup

```bash
# Copy example env
cp .env.example .env
```

### Required Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Random 32+ char secret |
| `BETTER_AUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `RESEND_API_KEY` | Resend transactional email key |
| `STRIPE_SECRET_KEY` | Stripe API secret |
| `GOCARDLESS_ACCESS_TOKEN` | GoCardless SEPA token |
| `GOOGLE_ADS_CUSTOMER_ID` | Google Ads customer ID (for OCI upload) |

## Installation

```bash
pnpm install
```

## Database

```bash
# Generate migrations from schema
pnpm drizzle-kit generate

# Run migrations
pnpm drizzle-kit migrate
```

## i18n (Paraglide)

Translations compile automatically during build. To manually compile:

```bash
pnpm paraglide:check
```

Message files: `project.inlang/` → generates to `src/paraglide/`

## Development

```bash
pnpm dev        # Dev server on port 3000
pnpm build      # Production build
pnpm typecheck  # TypeScript check
```

## Adapting This Kit

1. Change `name` in `package.json`
2. Change `APP_NAME` in `ecosystem.config.cjs`
3. Update `manifest.json` with your app name/icons
4. Update font links in `__root.tsx` if needed
5. Set environment variables in `.env`
