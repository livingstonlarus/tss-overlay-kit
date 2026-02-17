import { createRouter as createTanStackRouter } from '@tanstack/solid-router'
import { routeTree } from './routeTree.gen'

export function createRouter() {
    const router = createTanStackRouter({
        routeTree,
        // DE-002 v4.1 Speed Config
        defaultPreload: 'intent',
        defaultStaleTime: 5000,
        scrollRestoration: true,
    })
    return router
}

// TanStack Start expects getRouter
export const getRouter = createRouter

declare module '@tanstack/solid-router' {
    interface Register {
        router: ReturnType<typeof createRouter>
    }
}
