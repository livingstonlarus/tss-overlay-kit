import { createServerFn } from '@tanstack/solid-start'
import { db } from './db'
import { trafficLogs } from './schema'
import { v4 as uuidv4 } from 'uuid'

export const trackTraffic = createServerFn({ method: "POST" })
    .validator((data: { gclid?: string } | undefined) => data)
    .handler(async ({ data }) => {
        // DE-002 §14.2 — Dynamic import to satisfy bundler for server-only modules
        const { getCookie, setCookie } = await import('vinxi/http')

        let sessionId = getCookie('session_id')
        const gclid = data?.gclid

        if (!sessionId) {
            sessionId = uuidv4()
            setCookie('session_id', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
                sameSite: 'lax'
            })
        }

        if (gclid) {
            try {
                await db.insert(trafficLogs).values({
                    sessionId,
                    gclid,
                    googleUploadStatus: 'PENDING'
                }).onConflictDoUpdate({
                    target: trafficLogs.sessionId,
                    set: { gclid }
                })
            } catch (e) {
                console.error('Failed to log traffic:', e)
            }
        }

        return { sessionId }
    })
