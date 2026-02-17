# Installation and Deployment Guide

## 💻 Local Development (macOS)

### Prerequisites
- Node.js v22+
- pnpm

### Setup
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
    ```bash
    pnpm install
    # Install standard stack if missing from CLI scaffold
    pnpm add -D tailwindcss postcss autoprefixer
    pnpm add @tanstack/solid-query @tanstack/solid-router
    pnpm add better-auth drizzle-orm @neondatabase/serverless
    ```

4.  **Start Development Server:**
    ```bash
    pnpm dev
    ```
    The app will be available at `http://localhost:3000`.

---

## 🌍 Production Deployment (OpenBSD)

### Target Environment
- **OS**: OpenBSD
- **Directory**: `/var/www/htdocs/<project_name>`
- **Port**: `3000` (Default)
- **Process Manager**: PM2
- **Web Server**: Nginx (Reverse Proxy + ACME SSL)

### Deployment Protocol (Git Strategy)

1. **Update Codebase:**
   SSH into the server and pull the latest changes.
   ```bash
   cd /var/www/htdocs/<project_name>
   git pull origin main
   ```

2. **Install & Build:**
   ```bash
   pnpm install --prod
   pnpm build
   ```

3. **Database Migrations:**
   Ensure your Neon database is accessible and run migrations:
   ```bash
   npx drizzle-kit migrate
   ```

4. **Restart Service (PM2):**
   ```bash
   pm2 restart <project_name>
   ```

### Nginx Configuration (Reverse Proxy Template)

Configure Nginx to proxy traffic to the app port (default 3000) and handle SSL via ACME.

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    # ACME Challenge
    location /.well-known/acme-challenge/ {
        root /var/www/acme;
    }

    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name example.com www.example.com;

    ssl_certificate /etc/ssl/example.com.fullchain.pem;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Verification
- Check PM2 status: `pm2 status`
- Check logs: `pm2 logs <project_name>`
- Verify HTTPS access: `curl -I https://example.com`
