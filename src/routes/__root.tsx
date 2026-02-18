import * as Solid from 'solid-js'
import { HydrationScript } from 'solid-js/web'
import {
    Outlet,
    createRootRoute,
    HeadContent,
    Scripts,
} from '@tanstack/solid-router'

import "../app.css"

import { trackTraffic } from '../server/attribution'

// Define search params validation
type SearchParams = {
    gclid?: string
}

export const Route = createRootRoute({
    validateSearch: (search: Record<string, unknown>): SearchParams => {
        return {
            gclid: typeof (search as any).gclid === 'string' ? (search as any).gclid : undefined,
        }
    },
    loader: async ({ location }) => {
        // DE-002 v4.1 Attribution Protocol (Server-Side)
        const gclid = location.search.gclid
        const { sessionId } = await trackTraffic({ data: { gclid } })
        return { sessionId }
    },
    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { title: 'New TSS App' },
            { name: 'theme-color', content: '#0057FF' },
        ],
        links: [
            // DE-004 §2 Typography: Barlow Condensed (headers), Manrope (controls), JetBrains Mono (data), Inter (body)
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600&display=swap' },
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

import { getLocale } from '../paraglide/runtime'

function RootDocument(props: Readonly<{ children: Solid.JSX.Element }>) {
    return (
        <html lang={getLocale()}>
            <head>
                <HeadContent />
                <HydrationScript />
            </head>
            <body>
                <Solid.Suspense fallback={<div>Loading...</div>}>
                    {props.children}
                </Solid.Suspense>
                <Scripts />
            </body>
        </html>
    )
}
