# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-02-18
### Changed
- **`router.tsx`**: Renamed `createRouter` → `getRouter` (matches `tanstack create` scaffold convention). Uses `defaultPreloadStaleTime` property.
- **`__root.tsx`**: Aligned to latest TanStack Start API — uses `shellComponent` pattern, `HeadContent` in body (streaming), CSS via `?url` import.
- **`package.json`**: Version set to `0.0.0` placeholder (downstream projects set their own).
### Removed
- **`public/favicon.ico`**: Removed empty placeholder — scaffold provides a real favicon that should be preserved during overlay.
### Fixed
- **Tailwind v4 compatibility**: Overlay cleanly replaces scaffold's Tailwind v4 (`@tailwindcss/vite`) with v3 (PostCSS). Cleanup step documented for orphaned `src/styles.css`.

## [1.2.0] - 2026-02-18
### Added
- **Valibot**: Input validation layer (replaces Zod). DE-002 §3.2.
- **Paraglide v2**: i18n with 22 SEPA locales, compiled runtime. DE-002 §7.1.
- **Kobalte UI**: Headless accessible primitives (Button component). DE-002 §6.1.
- **Google Ads Upload**: `uploadOfflineConversion` server function. DE-002 §4.3.
- **GCLID Persistence**: Server-side attribution via `traffic_logs` table. DE-002 §4.3.
- **i18n Truth Cascade**: Ads > Path > Cookie > GeoIP locale resolution. DE-002 §7.1.
- **All DE-004 Fonts**: Barlow Condensed, Manrope, JetBrains Mono, Inter via Google Fonts.
- **PWA Manifest**: `public/manifest.json` with `display: standalone`. DE-002 §15.2.
- **Robots.txt**: `public/robots.txt`. DE-002 §15.1.
- **Semgrep Gate**: `.semgrepignore` for security scanning. DE-002 §3.3.
- **Docs Folder**: DE-002 v4.1, DE-004 v5.2, TanStack Start RC docs bundled.
- **Documentation**: Comprehensive README.md, INSTALL.md, DEPLOY.md.
### Changed
- **DB Driver**: Replaced `@neondatabase/serverless` with `postgres` (Postgres.js). DE-002 §4.1.
- **Tailwind Config**: Aligned color keys to DE-002 §13.2 (`matte`/`dim`/`backlight`/`readout`).
- **Root Layout**: Fixed Paraglide v2 import (`getLocale` instead of `languageTag`).
- **CSS Variables**: Aligned to DE-002 §13.1 System-Sync architecture.
### Removed
- `zod` — replaced by Valibot (tree-shakable, modular).
- `@neondatabase/serverless` — forbidden on persistent Node.js servers.
- `src/entry-server.tsx` — redundant, `server-entry.mjs` handles this.

## [1.0.0] - 2026-02-17
### Added
- Official v1.0.0 stable release.
- Standardized PM2 `ecosystem.config.cjs`.
- Robust `server-entry.mjs` with `dotenv` and graceful shutdown.
- Detailed `DEPLOY.md` for OpenBSD/Nginx/ACME.
### Fixed
- Build-safe client-side GCLID attribution.
- Environment variable isolation on OpenBSD.
- Nginx bootstrap protocol for SSL challenges.

## [v0.1.2] - 2026-02-17

### Added
- **Rebranding**: Project renamed to **TSS Overlay Kit**.
- **Attribution Middleware**: Automated GCLID persistence (30-day HttpOnly cookie) in `routes/__root.tsx`.
- Implemented DE-002 v4.1 "Attribution Protocol" out of the box.

## [v0.1.1] - 2026-02-17

### Added
- **Stack Acceleration**: `package.json` now includes `@neondatabase/serverless`, `pm2`, and `resend` by default.
- **Static Assets**: Added `public/` directory with `manifest.json` and placeholder icons for PWA.
- **Documentation**: Updated `INSTALL.md` to reflect simplified "battery-included" installation.

## [v0.1.0] - 2026-02-17

### Added
- Initial Project Bootstrap from Universal TSS Template v5.2.
- Core Architecture: TanStack Start + SolidJS + Vinxi.
- Database: Drizzle ORM + Neon.
- Authentication: Better Auth configuration.
- Visual Identity: DE-004 v5.2 (DIN Console).
- Engineering Standard: DE-002 v4.1 compliant.
- Workflows: Automated Deployment (Git Strategy) and Release protocols.
- Documentation: README, INSTALL, CHANGELOG.
