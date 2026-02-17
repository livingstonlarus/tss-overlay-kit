# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1.2] - 2026-02-17

### Added
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
