import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; // Assumes db is exported from src/server/db.ts
import { magicLink } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start/solid";
import { sendMagicLink } from "./email";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true
    },
    plugins: [
        magicLink({
            sendMagicLink: async ({ email, token, url }) => {
                await sendMagicLink({ email, token, url });
            }
        }),
        tanstackStartCookies()
    ],
});
