import { createServerFn } from '@tanstack/solid-start'
import { getCookie, setCookie } from 'vinxi/http'
import { db } from './db'
import { trafficLogs } from './schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export const trackTraffic = createServerFn({ method: "POST" })
    .validator((data: { gclid?: string } | undefined) => data)
    .handler(async ({ data }) => {
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

        // Always upsert log if gclid is present or to track session
        // If gclid is present, we definitely want to log it logic
        if (gclid) {
            try {
                await db.insert(trafficLogs).values({
                    sessionId,
                    gclid,
                    googleUploadStatus: 'PENDING'
                }).onConflictDoUpdate({
                    target: trafficLogs.sessionId,
                    set: { gclid } // Update gclid if session exists but acquired new gclid?
                })
            } catch (e) {
                console.error('Failed to log traffic:', e)
            }
        } else {
            // Optional: Log traffic without GCLID if needed, but schema requires PK.
            // If we just want to ensure session_id exists, we are done.
            // If we want to log every visit, we need a separate table or handle it here.
            // But DE-002 v4.1 says: "Upsert to traffic_logs ... Columns: session_id, gclid, ..."
            // implying it tracks GCLID events primarily.
        }

        return { sessionId }
    })
