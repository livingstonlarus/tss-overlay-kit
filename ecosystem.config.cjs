module.exports = {
    apps: [
        {
            name: 'tss-app',
            script: 'server-entry.mjs',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
        },
    ],
};
