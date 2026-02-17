---
description: How to deploy the application to OpenBSD (Git Strategy)
---

# Deploy to OpenBSD (Git Strategy)

**Constraint:** Do NOT use `scp` or `rsync` for code deployment. Use Git.

## 1. Local Verification
1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm build`
4. `npx @semgrep/semgrep --config auto .` (Must pass with NO errors)

## 2. Commit & Push
Ensure all changes are pushed to the remote repository.
```bash
git push origin main
```

## 3. Remote Deployment
SSH into the server and pull the latest changes.

1.  **SSH**:
    ```bash
    ssh user@HOST
    ```

2.  **Deploy (On Server)**:
    ```bash
    cd /var/www/htdocs/APP_DIR
    git pull origin main
    pnpm install --prod
    pnpm build
    npx drizzle-kit migrate
    pm2 restart APP_NAME
    ```

## 4. Verification
- Check status: `pm2 status`
- Check logs: `pm2 logs APP_NAME`
- Verify site is reachable and functioning.
