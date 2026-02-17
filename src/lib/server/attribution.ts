import { getCookie, setCookie } from 'vinxi/http'

export async function persistGclid(gclid: string) {
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
}
