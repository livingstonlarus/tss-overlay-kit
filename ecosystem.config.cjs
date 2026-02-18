// DE-002 §14.5 — PM2 Ecosystem (Production Runtime)
module.exports = {
    apps: [
        {
            name: 'APP_NAME',
            script: 'server-entry.mjs',
            interpreter: 'node',
            instances: 'max',       // Uses all cores (Cluster Mode)
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
        },
    ],
};
