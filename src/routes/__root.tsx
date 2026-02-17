import * as Solid from 'solid-js'
import { HydrationScript } from 'solid-js/web'
import {
    Outlet,
    createRootRoute,
    HeadContent,
    Scripts,
} from '@tanstack/solid-router'

import "../app.css"

import { createServerFn } from '@tanstack/solid-start'

const setGclidCookie = createServerFn('GET', async (gclid: string) => {
    const { getCookie, setCookie } = await import('vinxi/http')
    const existing = getCookie('gclid')
    if (existing !== gclid) {
        setCookie('gclid', gclid, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 Days
            path: '/',
        })
    }
})

export const Route = createRootRoute({
    beforeLoad: async ({ location }) => {
        // DE-002 v4.1 Attribution Protocol (GCLID Persistence)
        if (location.search.includes('gclid=')) {
            const params = new URLSearchParams(location.search)
            const gclid = params.get('gclid')
            if (gclid) {
                await setGclidCookie(gclid)
            }
        }
    },
    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { title: 'New TSS App' },
        ],
        links: [
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
            // DE-002 v4.1 PWA Standards
            { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
            { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
            { rel: 'manifest', href: '/manifest.json' },
        ],
    }),
    component: RootComponent,
})

function RootComponent() {
    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
    )
}

function RootDocument({ children }: Readonly<{ children: Solid.JSX.Element }>) {
    return (
        <html lang="en">
            <head>
                <HeadContent />
                <HydrationScript />
            </head>
            <body>
                <Solid.Suspense fallback={<div>Loading...</div>}>
                    {children}
                </Solid.Suspense>
                <Scripts />
            </body>
        </html>
    )
}
