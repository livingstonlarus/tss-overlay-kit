import { createRouter as createTanStackRouter } from '@tanstack/solid-router'
// @ts-expect-error — routeTree.gen is auto-generated at build time
import { routeTree } from './routeTree.gen'

export function getRouter() {
    const router = createTanStackRouter({
        routeTree,
        // DE-002 v4.1 Speed Config
        scrollRestoration: true,
        defaultPreload: 'intent',
        defaultPreloadStaleTime: 5000,
    })
    return router
}

declare module '@tanstack/solid-router' {
    interface Register {
        router: ReturnType<typeof getRouter>
    }
}
