import { baseLocale, locales, type Locale, setLocale } from '../paraglide/runtime'

/**
 * Resolves the locale for a given request using the "Truth Cascade" protocol.
 * Priority: 1. Ads (GCLID/gl/lang) > 2. Path (/fr/...) > 3. Cookie > 4. GeoIP (Accept-Language)
 */
export function resolveLocale(url: URL, headers: Headers): Locale {
    // 1. The "Ads" Override (Highest Priority)
    const queryLang = url.searchParams.get('lang') || url.searchParams.get('gl')
    if (queryLang && isAvailableLocale(queryLang)) {
        return queryLang as Locale
    }

    // 2. The "Path" Authority
    const pathSegment = url.pathname.split('/')[1]
    if (pathSegment && isAvailableLocale(pathSegment)) {
        return pathSegment as Locale
    }

    // 3. The "Cookie" State
    const cookieHeader = headers.get('cookie')
    if (cookieHeader) {
        const match = cookieHeader.match(/PARAGLIDE_LOCALE=([^;]+)/)
        if (match && isAvailableLocale(match[1])) {
            return match[1] as Locale
        }
    }

    // 4. The "GeoIP" Fallback (Accept-Language header)
    const acceptLanguage = headers.get('accept-language')
    if (acceptLanguage) {
        const preferred = acceptLanguage.split(',')[0]?.split('-')[0]
        if (preferred && isAvailableLocale(preferred)) {
            return preferred as Locale
        }
    }

    return baseLocale
}

export function isAvailableLocale(locale: string): boolean {
    return (locales as readonly string[]).includes(locale.toLowerCase())
}
