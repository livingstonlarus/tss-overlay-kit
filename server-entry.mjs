import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { join, extname } from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import handler from './dist/server/server.js';
import 'dotenv/config';

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

// Minimal adapter to convert Node.js http request to Web Request
async function createWebRequest(req) {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
        if (Array.isArray(value)) {
            value.forEach(v => headers.append(key, v));
        } else if (value) {
            headers.set(key, value);
        }
    }

    const init = {
        method: req.method,
        headers,
        signal: AbortSignal.timeout(30000), // 30s timeout safety
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        init.body = Readable.toWeb(req);
        init.duplex = 'half';
    }

    return new Request(url, init);
}

const server = createServer(async (req, res) => {
    try {
        const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

        // Static file serving from dist/client
        const filePath = join(process.cwd(), 'dist/client', url.pathname === '/' ? 'index.html' : url.pathname);

        try {
            const stats = await stat(filePath);
            if (stats.isFile()) {
                const ext = extname(filePath);
                res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
                // Cache static assets (except html)
                if (ext !== '.html') {
                    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
                }
                const content = await readFile(filePath);
                res.end(content);
                return;
            }
        } catch (e) {
            // File not found, continue to app handler
        }

        const webReq = await createWebRequest(req);
        const webRes = await handler.fetch(webReq);

        res.statusCode = webRes.status;

        webRes.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        if (webRes.body) {
            const reader = webRes.body.getReader();
            const stream = new Readable({
                async read() {
                    const { done, value } = await reader.read();
                    if (done) {
                        this.push(null);
                    } else {
                        this.push(Buffer.from(value));
                    }
                }
            });
            stream.pipe(res);
        } else {
            res.end();
        }
    } catch (e) {
        console.error('Request Error:', e);
        if (!res.headersSent) {
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    }
});

const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
});

// Graceful Shutdown Logic (DE-002 v4.1)
const shutdown = () => {
    console.log('SIGTERM/SIGINT received. Shutting down...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
    // Force close after 10s
    setTimeout(() => {
        console.error('Forcing shutdown...');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
