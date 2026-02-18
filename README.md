# TSS Overlay Kit

**Version:** 1.2.0 | **Standard:** DE-002 v4.1 | **Visual:** DE-004 v5.2

The canonical starter template for all TanStack Start + SolidJS projects under the Daemon Engineering protocol.

## Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | TanStack Start (Solid) + Vinxi |
| **View** | SolidJS (fine-grained reactivity) |
| **UI** | Kobalte (headless) + Tailwind CSS v3 |
| **Data** | Drizzle ORM + Postgres.js |
| **Auth** | Better Auth |
| **Payments** | Stripe + GoCardless |
| **Email** | Resend |
| **i18n** | Paraglide JS (22 SEPA locales) |
| **Validation** | Valibot |
| **Ads** | GCLID Persistence + Google Ads Offline Upload |
| **Process** | PM2 (ecosystem.config.cjs) |
| **Security** | Semgrep gate |

## Quick Start

```bash
# 1. Clone the kit into your new project
cp -R tss-overlay-kit my-new-project
cd my-new-project

# 2. Update package.json name
# Edit "name" field in package.json

# 3. Install dependencies
pnpm install

# 4. Set up environment
cp .env.example .env
# Fill in DATABASE_URL, BETTER_AUTH_SECRET, etc.

# 5. Run dev server
pnpm dev
```

See [INSTALL.md](INSTALL.md) for detailed setup and [DEPLOY.md](DEPLOY.md) for production deployment.

## Kit Contents

```
├── docs/                    # Reference standards (DE-002, DE-004, TanStack)
├── public/                  # Static assets (manifest.json, robots.txt, favicons)
├── src/
│   ├── components/ui/       # Kobalte + Tailwind components (Button, etc.)
│   ├── lib/                 # Utilities (cn, i18n resolver)
│   ├── paraglide/           # Generated i18n runtime (22 SEPA locales)
│   ├── routes/              # File-system routing (__root.tsx, index.tsx)
│   └── server/              # Backend (db, auth, payments, email, attribution)
├── server-entry.mjs         # Custom Node.js entry (graceful shutdown)
├── ecosystem.config.cjs     # PM2 process manager config
├── tailwind.config.js       # DIN Console design tokens
└── project.inlang/          # Paraglide i18n configuration
```

## Standards Compliance

- **DE-002 v4.1** — Engineering Standard (architecture, security, deployment)
- **DE-004 v5.2** — Visual Identity System ("Clinical Instrument" aesthetic)
- **OpenBSD compatible** — No Nitro, no Edge drivers, no lightningcss

## License

Private — Daemon Engineering
