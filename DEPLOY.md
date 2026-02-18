# DEPLOY — TSS Overlay Kit

## Target: OpenBSD (Metal Server)

All projects under DE-002 v4.1 deploy to OpenBSD via Git strategy.  
**DO NOT** use rsync/scp for code deployment.

## Strategy

```
Git Pull → pnpm install → pnpm build → PM2 reload
```

## Prerequisites (Server)

- Node.js v22+ (via pkg_add)
- pnpm v10+
- PM2 (`pnpm add -g pm2`)
- Git configured with SSH key

## First Deployment

```bash
# 1. Clone repository
git clone git@github.com:livingstonlarus/APP_NAME.git /var/www/htdocs/APP_NAME
cd /var/www/htdocs/APP_NAME

# 2. Install dependencies
pnpm install

# 3. Set environment variables
cp .env.example .env
# Fill in production values

# 4. Build
pnpm build

# 5. Start with PM2
# First update ecosystem.config.cjs — change APP_NAME and PORT
pm2 start ecosystem.config.cjs
pm2 save
```

## Subsequent Deployments

```bash
cd /var/www/htdocs/APP_NAME
git pull origin main
pnpm install
pnpm build
pm2 reload APP_NAME
```

## Pre-Release Checklist (DE-002 §3.3)

```bash
# 1. Type check
pnpm typecheck

# 2. Build
pnpm build

# 3. Semgrep security scan
semgrep --config auto src/
```

Any Semgrep finding with `severity: error` is a **Hard Block**.

## Server Entry

Runtime command: `PORT=<port> node server-entry.mjs`

The `server-entry.mjs` wrapper:
- Loads `.env` via dotenv
- Serves static files from `dist/client/`
- Routes all other requests to the TanStack handler
- Handles SIGINT/SIGTERM for graceful PM2 reload

## Reverse Proxy (nginx)

```nginx
server {
    listen 443 ssl;
    server_name APP_NAME.com;

    ssl_certificate /etc/ssl/APP_NAME.com.fullchain.pem;
    ssl_certificate_key /etc/ssl/private/APP_NAME.com.key;

    location / {
        proxy_pass http://127.0.0.1:PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
