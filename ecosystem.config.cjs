module.exports = {
    apps: [
        {
            name: 'APP_NAME',
            script: 'server-entry.mjs',
            env: {
                NODE_ENV: 'production',
            },
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
        },
    ],
};
