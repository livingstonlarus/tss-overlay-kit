import {
    HeadContent,
    Outlet,
    Scripts,
    createRootRoute,
    redirect,
} from '@tanstack/solid-router'

import { HydrationScript } from 'solid-js/web'
import { Suspense } from 'solid-js'

import appCss from '../app.css?url'

import { trackTraffic } from '../server/attribution'
import { getLocale, setLocale } from '../paraglide/runtime'
import { resolveLocale, isAvailableLocale } from '../lib/i18n'

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
    beforeLoad: async ({ location, request }: any) => {
        // DE-002 §7.1 — Automatic Locale Redirection
        // 'request' is only available during SSR
        const headers = request ? request.headers : new Headers()
        const url = new URL(location.href)
        const locale = resolveLocale(url, headers)

        // Set the language tag for the request (both client and server)
        setLocale(locale, { reload: false })

        // If the path isn't starting with the resolved locale, redirect.
        // Example: / -> /fr or /about -> /en/about
        const pathSegment = location.pathname.split('/')[1]
        const isLocalized = pathSegment && isAvailableLocale(pathSegment)

        if (!isLocalized) {
            const newPath = `/${locale}${location.pathname === '/' ? '' : location.pathname}`
            throw redirect({
                to: newPath,
                search: location.search,
                replace: true,
            })
        }

        return { locale }
    },
    loader: async ({ location }) => {
        // DE-002 v4.1 Attribution Protocol (Server-Side)
        const search = location.search as SearchParams
        const gclid = search.gclid
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
            // App CSS (Tailwind v3 via PostCSS)
            { rel: 'stylesheet', href: appCss },
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
    // Use shellComponent (latest TanStack Start pattern)
    shellComponent: RootShell,
})

function RootShell() {
    return (
        <html lang={getLocale()}>
            <head>
                <HydrationScript />
            </head>
            <body>
                <HeadContent />
                <Suspense>
                    <Outlet />
                </Suspense>
                <Scripts />
            </body>
        </html>
    )
}
