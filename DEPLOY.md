# Deployment Guide

## Architecture

```
Client → nginx (SSL termination) → PM2 (Node.js cluster) → App
```

## Prerequisites

- **OpenBSD** server with `nginx`, `node`, and `pm2` installed
- SSL certificates (Let's Encrypt via `acme-client`)
- Git access to the repository

## Production Build

```bash
pnpm build
```

Output is placed in `.output/`.

## PM2 Setup

Update `ecosystem.config.cjs` for your project:

```js
name: 'your-app-name',   // Replace with project name
env: {
    PORT: 3001,           // Replace with assigned port
}
```

```bash
# Start
pm2 start ecosystem.config.cjs

# Monitor
pm2 monit

# Logs
pm2 logs your-app-name
```

## nginx Reverse Proxy

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate     /etc/ssl/yourdomain.com.fullchain.pem;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;

    location / {
        proxy_pass http://127.0.0.1:3001;
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

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}
```

## Git Deploy Strategy

```bash
# On server
cd /var/www/htdocs/your-app
git pull origin main
pnpm install --frozen-lockfile
pnpm build
pm2 restart your-app-name
```

## Pre-Release Checklist

Before any release:

```bash
pnpm typecheck
pnpm lint
pnpm build
npx @semgrep/semgrep --config auto .
```

All four must pass. If any fails, do not release.
