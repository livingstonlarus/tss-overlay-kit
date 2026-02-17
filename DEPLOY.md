# Production Deployment Protocol (OpenBSD)

**Standard: DE-002 v4.1**
**Target OS: OpenBSD 7.x**

This guide details the standard procedure for deploying TanStack Start applications (or static sites) built with the **TSS Overlay Kit** to the Daemon Engineering OpenBSD infrastructure.

## 1. Preparation

### 1.1. Server Access & Git Auth
Ensure you have SSH access to the server. The standard management user is `otobotto`.

**Git Auth (SSH Recommended):**
To avoid entering credentials, set up an SSH key on the server and add it to GitHub:
```bash
ssh-keygen -t ed25519 -C "otobotto@daemon.engineering"
# NOTE: For zero-touch automation on servers, leave the passphrase BLANK.
# If you used one and want to remove it: ssh-keygen -p -f ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
# Add this key to GitHub -> Settings -> SSH and GPG keys
```

### 1.2. Directory Structure
All web applications reside in `/var/www/htdocs/`.

---

## 2. Initial Deployment

### 2.1. Clone Repository (Admin)
Using **SSH URLs** is preferred for automation.

```bash
cd /var/www/htdocs/
doas git clone git@github.com:livingstonlarus/<project_name>.git
```

### 2.2. Fix Ownership (Critical)
Transfer ownership to the management user (`otobotto`) and the web group (`www`). This allows you to manage files without `doas` while ensuring Nginx (running as `www`) can access them.

```bash
# Set ownership to otobotto:www
doas chown -R otobotto:www /var/www/htdocs/<project_name>
```

---

## 3. Build & Configure

### 3.1. Install & Build
Now that you own the directory, proceed as `otobotto`:

```bash
cd /var/www/htdocs/<project_name>

pnpm install
pnpm build
```

### 3.2. Environment Variables
Create the production `.env` file.

```bash
cp .env.example .env
```

**Port Assignment:**
Update the `PORT` variable. Do not use the default 3000 if it's taken.
*   `3001`: `cbamshield`
*   `3002`: `waredeck`
*   `3003`: `certifyprompt`
*   `3004`: `dpplinks`
*   `3005`: `zatcacheck`

```bash
# Example: Change 3000 to 3005
sed -i 's/PORT=3000/PORT=3005/g' .env
sed -i 's/localhost:3000/localhost:3005/g' .env
```

**Secrets:**
Edit `.env` to add production secrets (`DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.).

---

## 4. Service Management (PM2)
We use **PM2** to manage Node.js processes.

```bash
# 1. Update the app name in the ecosystem config
sed -i "s/name: 'APP_NAME'/name: '<project_name>'/g" ecosystem.config.cjs

# 2. Start the app
pm2 start ecosystem.config.cjs

# 3. Save the process list (so it restarts on reboot)
pm2 save
```

> **Note:** If this is a static site (e.g., `daemonengineering`), PM2 is not needed. Nginx will serve the `/dist` folder directly.

---

## 5. SSL & Nginx

### 5.1. Obtain SSL Certificate (ACME)
Add the domain to `/etc/acme-client.conf` and request a certificate.

```bash
# 1. Add domain to acme-client.conf (requires doas)
# 2. Request cert
doas acme-client <domain.com>
```

### 5.2. Configure Nginx
Create or update the server block in `/etc/nginx/nginx.conf`.

**Reverse Proxy Template (Node.js Apps):**
```nginx
server {
    listen 443 ssl;
    server_name <domain.com>;
    ssl_certificate /etc/ssl/<domain.com>.crt;
    ssl_certificate_key /etc/ssl/private/<domain.com>.key;
    include ssl_params.conf;

    location / {
        proxy_pass http://127.0.0.1:<PORT>;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Static Site Template:**
```nginx
server {
    listen 443 ssl;
    server_name <domain.com>;
    ssl_certificate /etc/ssl/<domain.com>.crt;
    ssl_certificate_key /etc/ssl/private/<domain.com>.key;
    include ssl_params.conf;

    root /var/www/htdocs/<project_name>/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 5.3. Reload Nginx
```bash
doas nginx -t
doas rcctl reload nginx
```

---

## 6. Updates (Orphan Branch Strategy)

To update the project with new code or overlay standards:

```bash
cd /var/www/htdocs/<project_name>
git pull origin main
pnpm install
pnpm build
pm2 restart <project_name>
```
