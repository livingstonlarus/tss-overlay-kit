# Installation and Deployment Guide

## 💻 Local Development (macOS)

### Prerequisites
- Node.js v22+
- pnpm

### Setup (The Orphan Branch Strategy)

This kit is designed to be overlayed onto a fresh TanStack CLI scaffold using Git.

1.  **Scaffold Project (TanStack CLI):**
    Use the official CLI to generate the base structure.
    ```bash
    npx @tanstack/cli create <project_name>
    ```
    *   **Select**: `Start` -> `Solid` -> `Vinxi` -> `None/Basic`
    *   **Skip**: Drizzle/Auth (we overlay these manually via template standards)

2.  **Apply The Overlay (Git Merge):**
    We use a dedicated "overlay" remote to merge our standards without messy copying.
    
    ```bash
    cd <project_name>
    
    # 1. Add the Overlay Kit as a remote
    git remote add overlay <git-url-to-tss-overlay-kit>
    git fetch overlay
    
    # 2. Checkout the overlay files (Force Overwrite)
    # This pulls all files from the overlay kit into your working directory
    git checkout overlay/main -- .
    
    # 3. Review & Commit
    # You will see the diffs. Verify the standards are applied.
    git add .
    git commit -m "feat: apply DE-002 overlay standards"
    ```

3.  **Install Dependencies:**
    
    The overlay kit includes a "battery-included" `package.json` with all standard stack dependencies (Tailwind, Drizzle, Better Auth, Neon, PM2, Resend).

    ```bash
    pnpm install
    ```

4.  **Start Development Server:**
    ```bash
    pnpm dev
    ```
    The app will be available at `http://localhost:3000`.

---

## 🌍 Production Deployment (OpenBSD)

For detailed, step-by-step production deployment on the Daemon Engineering infrastructure, please refer to:
👉 **[DEPLOY.md](./DEPLOY.md)**

### Key Highlights:
- **OS**: OpenBSD 7.x
- **Build**: `pnpm build` (generates SSR + Client artifacts)
- **Runtime**: Node.js v22 via PM2
- **Proxy**: Nginx + ACME SSL
- **Persistence**: `pm2 save` for reboot survival
