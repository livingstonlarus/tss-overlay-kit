# Coding Standards (SolidJS + TanStack Start)

## 1. The Performance Mandate ("Wiz-Like")
- **Speed is the primary economic variable.**
- **KPIs**: LCP < 800ms, CLS = 0, TTI < 1s.
- **The "React Tax" Ban**: All projects MUST use SolidJS.

## 2. Server Architecture
- **Monolithic Reliability**: Requires Node.js 22+ (LTS) via Vinxi.
- **The "Isomorphic Trap" (CRITICAL WARNING)**:
  - `loader` code runs on BOTH Server and Client.
  - **Constraint**: NEVER write DB queries, Secrets, or `process.env` in loaders/components.
  - **Solution**: All backend logic MUST reside in `server functions` or dedicated API routes.
- **Server Functions**:
  - Place logic in `src/server/` or `createServerFn`.
  - Thorough Zod/Valibot validation at boundaries.
- **Static Assets**: Custom server entries must implement static file handlers for `dist/client`.

## 3. Data Loading
- **Strict Rule: NO `useEffect` for data fetching.**
- Use `loader` in `Route` definitions to fetch data before rendering.
- Use `createServerFn` for backend logic.

## 4. Visual Identity (DE-004 v5.2)
- **Design Philosophy: "The Clinical Instrument"**
  - **Anti-Luxury Protocol**: We are an infrastructure brand, not a luxury brand. No elegant serifs.
  - **Voice**: Industrial Conglomerate. "Asset deployment sequence initiated," not "We're launching an MVP."
- **System-Sync**: NO "Dark Mode Toggle". Strictly follows `prefers-color-scheme`.
- **The Slot Philosophy**:
  - Containers have `border-b` or `border-r` with `border-din-border`.
  - Never use `bg-white/black`. Always use `bg-dashboard-base`.
- **CSS**:
  - Use CSS Modules or Tailwind.
  - **FORBIDDEN**: Runtime CSS-in-JS.
  - **tooling**: Standard PostCSS plugin. **DO NOT** use `@tailwindcss/vite`.

## 5. Security Gates (The Robocop)
- **Hard Block**: If `semgrep` finds ANY error, deployment is blocked.
- **Input Validation**: Never trust the client. Validate everything.

## 6. Type Safety
- Strict TypeScript. No `any`.
- Share types via inferred return types.

## 7. Forms & Actions
- Use conventional HTML forms handled by fully typed Server Functions.

## 9. Tooling & Scaffolding
- **CLI Mandate**: Always use `@tanstack/cli` to scaffold new projects or add integrations (e.g., `npx @tanstack/cli add`).
- **Documentation**: Use the CLI's MCP server for context-aware searching of TanStack docs.
- **The Overlay**: After scaffolding, strictly apply the `tss_template` standards (Visual Identity, Server Entry, Workflows).

## 10. Root Cause Analysis
- Explain root cause before fixing bugs.
- Verify SolidJS reactivity tracking issues.
