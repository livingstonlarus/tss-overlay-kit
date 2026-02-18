# **DE-002 \- ENGINEERING STANDARD**

**Version:** 4.0

**Context:** Implements DE-001 \- OPERATING PROTOCOLS v8.0 & DE-004 \- VISUAL IDENTITY SYSTEM v4.1

## **SYSTEM CONSTRAINTS**

* **Core Architecture:** TanStack Start (TSS) for Solid \+ Vinxi (Node.js)  
* **Data Layer:** Drizzle ORM \+ Neon (Serverless Postgres)  
* **Auth Layer:** Clerk (Managed Infrastructure)  
* **Comms Layer:** Resend (Transactional Email)  
* **Performance KPIs:**  
  * LCP (Largest Contentful Paint) \< 800ms  
  * CLS (Cumulative Layout Shift) \= 0  
  * TTI (Time to Interactive) \< 1s  
* **Attribution:** GCLID Persistence (Server-Side Cookies)

### **Build Tooling**

* **Tailwind CSS v3** via standard PostCSS plugin (tailwindcss \+ autoprefixer). **DO NOT** use @tailwindcss/vite or Tailwind v4 (lightningcss is incompatible with OpenBSD).  
* **Server Protocol:** Custom Node.js entry point (server-entry.mjs) wrapping the TanStack Start handler. **DO NOT** use Nitro (incompatible build dependencies on OpenBSD).  
* **SSR Protocol:** vite-plugin-solid MUST be configured with { ssr: true }.  
* **Artifact Source:** Production source of truth is dist/ (client/server) driven by server-entry.mjs.

## **1\. The Performance Mandate: "Wiz-Like" Architecture**

**Directive:** The application must emulate the performance profile of the Google Play Store (built on the internal "Wiz" framework). Speed is not a feature; it is the primary economic variable.

### **1.1 The "React Tax" Ban**

* **Constraint:** All projects under this standard **MUST** use **Solid** (SolidJS) as the underlying view library for TSS.  
* **Reasoning:** React's Virtual DOM (VDOM) introduces unavoidable overhead. Solid's fine-grained reactivity allows for "Zero-Hydration" on static content.  
* **Agent Instruction:** Do not suggest Next.js or React. Initialize all projects with the Solid preset of TSS.

### **1.2 The "Isomorphic Trap" (CRITICAL WARNING)**

* **Context:** TSS is **Isomorphic by Default**.  
* **The Danger:** loader code runs on the Server (SSR) **AND** the Client (Navigation).  
* **The Constraint:** You **CANNOT** write Database queries, Secrets, or process.env access directly inside a loader or Component.  
* **Solution:** ALL backend logic must reside in **server functions** (using createServerFn) or dedicated API routes.

### **1.3 The Monolithic Reliability Clause**

* **Directive:** Therefore, to satisfy requirements for "Monolithic Reliability," "Optimistic UI," and "Zero-Hydration" efficiency, the architecture must utilize **Node.js (LTS v22+)** running within the **Vinxi Node Server Preset**.  
* **Rationale:** This configuration provides the only verified environment for the isomorphic execution of SolidJS, the secure handling of Clerk authentication, and the unrestricted vertical scaling of Puppeteer instances required for the protocol's verification layers.

### **1.4 TypeScript Configuration Mandate**

* **Constraint:** tsconfig.json MUST be configured to support Solid JSX and modern bundler resolution to prevent hydration mismatches.

{  
  "compilerOptions": {  
    "jsx": "preserve",  
    "jsxImportSource": "solid-js",  
    "moduleResolution": "Bundler",  
    "module": "ESNext",  
    "target": "ES2022",  
    "skipLibCheck": true,  
    "strict": true,
    "noEmit": true,
    "isolatedModules": true
  }  
}


## **2\. Directory Structure (The "Monorepo" Feel)**

**Constraint:** Maintain strict separation of concerns to allow future extraction.

app/  
├── components/    \# Shared UI (Buttons, Inputs)  
├── routes/        \# File-system routing (Flat Routes)  
├── server/        \# Server Functions (RPC-like)  
├── app.tsx        \# Root Entry  
└── client.tsx     \# Client Entry

lib/               \# Shared Utilities (Valibot schemas, formatters)

server/            \# Backend-Only Code (DB, Auth, Emails)  
├── db/            \# Drizzle Schemas & Connection  
└── services/      \# Business Logic

.conductor/        \# CDD Artifacts (MANDATORY)  
├── product.md     \# Vision, Type (CaaS/DaaS/PaaS/MaaS) & Value Prop (DE-001 6.1)  
├── tech-stack.md  \# Locked Constraints  
└── spec.md        \# Current Task Log

public/            \# Static Assets (Favicon, Manifest, Robots.txt)  
drizzle.config.ts  \# ORM Config  
ecosystem.config.cjs \# PM2 Config (MANDATORY)

## **3\. Security & Environment**

### **3.1 The ".env" Law**

* **Rule:** Secrets never enter the code. Use .env for local and Platform Variables (Vercel/Netlify) for prod.  
* **Rule:** Prefix public variables with VITE\_.

### **3.2 Input Validation**

* **Rule:** Every Server Function must validate inputs using **Valibot**.  
* **Rule:** Never trust the client. Partial hydration allows spoofing.

### **3.3 The "Robocop" Security Gate**

* **Constraint:** Before any deployment, Semgrep must run.  
* **Rule:** Any finding with severity: error is a Hard Block.  
* **Target:** Prevent "Dark Data" leaks and hardcoded secrets.

## **4\. Database & Drizzle**

### **4.1 Schema Definition**

* **Rule:** Use drizzle-orm/pg-core.  
* **Rule:** Use snake\_case for SQL columns, camelCase for TS properties.  
* **Rule:** Artifact tables MUST include a raw\_input JSONB column.  
* **Constraint:** Data Retention: Indefinite for audit trails (Anti-PaaS Logic).  
* **Driver Constraint:** Since we are running on a persistent Node.js server (Section 1.3), you **MUST** use the standard pg driver (node-postgres) or postgres (Postgres.js) with Drizzle.  
* **Forbidden Driver:** **DO NOT** use @neondatabase/serverless (HTTP/WS driver). This driver is specifically designed for Edge environments (Cloudflare Workers/Vercel Edge) and introduces unnecessary latency/overhead in a long-running Node.js container where standard connection pooling is available.

### **4.2 Migration Strategy**

* **Rule:** drizzle-kit generate and drizzle-kit migrate. No manual SQL.

### **4.3 The Attribution Protocol (OCI \+ GCLID)**

* **Constraint:** Global Layout (routes/\_\_root.tsx) must execute the "Session Binding" logic on every entry.  
* **Logic:**  
  1. Extract ?gclid= from URL.  
  2. Generate/Read ephemeral session\_id cookie (HttpOnly, 30-day).  
  3. Upsert to DB table traffic\_logs:  
     * Columns: session\_id (PK), gclid, google\_upload\_status ('PENDING').  
  4. On Conversion (Welcome Credit):  
     * Link session\_id to the conversion\_value in the database.  
     * This enables the OCI Robot to pull PENDING rows.  
* **Rationale:** 30% of Ad spend is lost without offline feedback loops.

## **5\. Auth (Clerk)**

* **Constraint:** Use @clerk/tanstack-start.  
* **Constraint:** User metadata MUST include B2B Identity fields:  
  * VAT Number  
  * Company Name  
  * EORI Number (if applicable)  
* **Rule:** Protected Routes must check auth() in the **loader** or **middleware**.  
* **Rule:** Do not roll your own auth.

## **6\. UI/UX (Kobalte & Tailwind)**

### **6.1 Component Library**

* **Constraint:** Use **Kobalte** for accessible, headless primitives (when added).  
* **Constraint:** Use **Tailwind CSS v3** for styling.

### **6.2 Class Management**

* **Rule:** Use clsx and tailwind-merge (cn utility).  
* **Rule:** Do not use style prop for dynamic values; use CSS variables.

## **7\. Internationalization (DE-001 2.2)**

### **7.1 Detection Hierarchy (The "Truth" Cascade)**

The middleware (app/server.ts) must resolve locale and context in this strict order:

1. **The "Ads" Override (Highest Priority):**  
   * **Check:** URL Query Params: ?lang=fr or ?gl=FR (Google Location).  
   * **Action:** If present, set strict Cookie (NEXT\_LOCALE=fr, NEXT\_CURRENCY=EUR) and **Hard Redirect** to the canonical path domain.com/fr/tool.  
2. **The "Path" Authority:**  
   * **Check:** URL Path: Does it start with a supported locale (/fr, /es)?  
   * **Action:** If yes, render that locale. This allows Googlebot to index everything.  
3. **The "Cookie" State:**  
   * **Check:** NEXT\_LOCALE cookie.  
   * **Action:** If hitting Root /, redirect to /\[cookie\_locale\]/.  
4. **The "GeoIP" Fallback (Lowest Priority):**  
   * **Check:** Accept-Language header or Cloudflare CF-IPCountry header.  
   * **Action:** Redirect to best match.

### **7.2 Currency Decoupling**

* **Constraint:** Never bind currency strictly to language.  
* **Logic:**  
  * Currency is determined by **Country** (IP/Param), not **Language**.  
  * Defaults: US \-\> USD, FR/DE/ES \-\> EUR, GB \-\> GBP.  
  * Persistence: Store currency in a separate cookie.  
  * Frontend: Pass currency as a context variable to createServerFn to format prices on the server.

### **7.3 Middleware Implementation (TSS RC Compatible)**

* **Constraint:** Use `createMiddleware` to wrap requests with typed context.

```typescript
// app/middleware/i18n.ts
import { createMiddleware } from '@tanstack/solid-router'

export const i18nMiddleware = createMiddleware().middleware(async ({ next, request }) => {
  const url = new URL(request.url)
  const locale = resolveLocale(url, request.headers) // Implement truth cascade logic
  
  // Provide locale to the context for downstream loaders/actions
  return next({
    context: {
      locale
    }
  })
})
```


## **8\. Forms & Actions**

* **Rule:** Use createsServerFn from @tanstack/solid-start.  
* **Rule:** Return structured objects { success: boolean, error?: string, data?: any }.  
* **Rule:** Handle errors gracefully in UI (Toast/Alert).

## **9\. Testing**

* **Rule:** Unit test complex utilities (lib/).  
* **Rule:** E2E test critical flows (Signup, Payment).  
* **Rule:** Do not test UI components in isolation (Snapshot fatigue).

## **10\. The Verification Route**

* **Standard:** Public /verify/$uuid route.  
* **Logic:** This route must render a static, read-only view of a "Certified Artifact" (Audit Log, Certificate) to serve as a Trust Anchor.

## **11\. Implementation Directives for Agents**

* **Strict Typing:** noImplicitAny is ON.  
* **Solid Props:** NEVER DESTRUCTURE PROPS.  
* **UI Library:** Use **Kobalte** (Headless): https://kobalte.dev/docs/core/overview/introduction/  
* **Mobile-First:** Inputs 16px min. Sticky Footers. Bottom Drawers.  
* **Zero Waste Testing:** E2E tests for Critical Paths only.  
* **Fail-Fast Env:** Use env.ts.  
* **The "Existence Proof" (Server Entry Implementation Rule):**  
  * **Constraint:** You must explicitly define the **Known Good Configuration** for app/server.ts when using Paraglide for i18n.  
  * **Constraint:** Explicitly forbid importing router-manifest from @tanstack/solid-start as it is deprecated in newer versions.  
  * **Mandatory Pattern:**

// app/server.ts  
import { createStartHandler, defaultStreamHandler } from '@tanstack/solid-start/server'  
import { createRouter } from './router'  
// import { paraglideMiddleware } from './lib/paraglide' // When i18n is active

export default createStartHandler({  
  createRouter,  
  getRouterManifest: () \=\> import('./route-tree.gen').then(m \=\> m.routeTree), // Modern Vinxi pattern  
})(async (event) \=\> {  
    // Note: Wrap with middleware here if needed:   
    // const response \= await i18nMiddleware(event, () \=\> defaultStreamHandler(event));  
    // if (response) return response;  
    return defaultStreamHandler(event);  
})

## **12\. The "Wiz" Heuristic (Mental Check)**

Before finalizing any component, ask:

"Does this feature require JavaScript to be visible? If yes, can we move the logic to the CSS or Server?"

If the answer is **YES**, refactor.

## **13\. Visual Identity System (Implementation of DE-004)**

* **Objective:** Implement "High-Fidelity Brutalism" (DIN Console) with System-Sync.  
* **Strategy:** Pure CSS Variables (Zero-Runtime JS).  
* **Note:** Waredeck is an exception to the default DIN Console aesthetic. Waredeck implements a "Google Play Store" design language (Roboto/Google Sans fonts, rounded corners, Material-style shadows). The DIN Console tokens below remain the standard for all other projects under this protocol.

### **13.1 The "System-Sync" CSS Architecture**

* **Constraint:** NO "Dark Mode Toggle" buttons. NO local storage theme persistence.  
* **Mechanism:** The application strictly follows prefers-color-scheme.  
* **Implementation:** Define variables in the global CSS (e.g., app.css).

/\* app/app.css \*/  
@tailwind base;  
@tailwind components;  
@tailwind utilities;

@layer base {  
  :root {  
    /\* DAY MODE (Lab Equipment) \*/  
    \--bg-dashboard: 249 250 251; /\* \#F9FAFB \*/  
    \--bg-dim: 243 244 246;       /\* \#F3F4F6 \*/  
    \--border-din: 209 213 219;   /\* \#D1D5DB \*/  
    \--text-main: 17 24 39;       /\* \#111827 \*/  
    \--text-dim: 107 114 128;     /\* \#6B7280 \*/  
  }

  @media (prefers-color-scheme: dark) {  
    :root {  
      /\* NIGHT MODE (BMW Dashboard) \*/  
      \--bg-dashboard: 10 10 18;  /\* \#0A0A12 \*/  
      \--bg-dim: 31 41 55;        /\* \#1F2937 \*/  
      \--border-din: 55 65 81;    /\* \#374151 \*/  
      \--text-main: 243 244 246;  /\* \#F3F4F6 \*/  
      \--text-dim: 156 163 175;   /\* \#9CA3AF \*/  
    }  
  }  
}

### **13.2 The Tailwind Preset (DIN Console Default)**

* **Constraint:** Config must consume the CSS variables using rgb().  
* **File:** tailwind.config.js (use .js, not .ts, for OpenBSD compatibility).

// tailwind.config.js (DIN Console Standard)  
export default {  
  theme: {  
    extend: {  
      borderRadius: {  
        DEFAULT: '0px',  
      },  
      colors: {  
        // Structural (Adaptive)  
        dashboard: {  
          matte: 'rgb(var(--bg-dashboard) / \<alpha-value\>)',  
          dim: 'rgb(var(--bg-dim) / \<alpha-value\>)',  
        },  
        din: {  
          border: 'rgb(var(--border-din) / \<alpha-value\>)',  
        },  
        content: {  
          main: 'rgb(var(--text-main) / \<alpha-value\>)',  
          dim: 'rgb(var(--text-dim) / \<alpha-value\>)',  
        },  
        // Backlights (Constant \- High Saturation cuts through both modes)  
        backlight: {  
          orange: '\#FF5F00',  
          green: '\#00D445',  
          blue: '\#0057FF',  
        }  
      },  
      fontFamily: {  
        headline: \['Barlow Condensed', 'sans-serif'\],  
        label: \['Manrope', 'sans-serif'\],  
        readout: \['JetBrains Mono', 'monospace'\],  
      },  
      backgroundImage: {  
        'void-texture': 'repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(125,125,125,0.05) 19px, rgba(125,125,125,0.05) 20px)',  
      }  
    }  
  }  
}

### **13.3 Component Philosophy: "The Slot"**

* **Rule:** All containers have border-b border-din-border or border-r border-din-border.  
* **Rule:** Never use bg-white or bg-black. Always use bg-dashboard-matte.

## **14\. Build & Deployment Standards**

### **14.1 The OpenBSD Build Strategy**

* **Constraint:** To support server-side builds on OpenBSD (which lacks pre-built binaries for some Nitro/Vite dependencies), we rely on a custom entry point.  
* **Entry Point:** server-entry.mjs (in project root).  
* **Build Command:** vite build (Output: dist/server/server.js).  
* **Runtime:** PORT=\<port\> node server-entry.mjs.  
* **Process Manager:** PM2 (Configured via ecosystem.config.cjs).  
* **Deployment:** Git-based (git pull \+ pnpm install \+ pnpm build on server). **DO NOT** use rsync or scp for code deployment.

### **14.2 Server Entry Code (Graceful Shutdown Enabled)**

* **Constraint:** Use the createServerEntry wrapper.  
* **Constraint:** Implement SIGINT/SIGTERM listeners to close connections properly.

// server-entry.mjs  
import { createStartHandler, defaultStreamHandler } from '@tanstack/solid-start/server'
import { createServerEntry } from '@tanstack/solid-start/server-entry'
import { createRouter } from './dist/server/router.js'

const handler = createStartHandler({
  createRouter,
  getRouterManifest: () => import('./dist/server/route-tree.gen.js').then(m => m.routeTree),
})(defaultStreamHandler)

const server = createServerEntry({
  // Use defineHandlerCallback if custom wrapping is needed, otherwise direct fetch
  fetch: (request) => handler(request),
})


// Graceful Shutdown Logic (Required for PM2 reload)  
const shutdown \= () \=\> {  
  console.log('SIGTERM/SIGINT received. Shutting down...');  
  // Add database disconnection logic here if needed  
  process.exit(0);  
};

process.on('SIGTERM', shutdown);  
process.on('SIGINT', shutdown);

export default server;

### **14.3 The Verified Vite Configuration**

* **Constraint:** This is the single source of truth for vite.config.ts. All projects under this standard MUST use this configuration.

// vite.config.ts  
import { defineConfig } from 'vite';  
import viteTsConfigPaths from 'vite-tsconfig-paths';  
import { tanstackStart } from '@tanstack/solid-start/plugin/vite';  
import viteSolid from 'vite-plugin-solid';

export default defineConfig({  
  plugins: \[  
    viteTsConfigPaths(),  
    tanstackStart(),  
    // DO NOT add nitro() \-\> incompatible with OpenBSD  
    viteSolid({ ssr: true }),  
  \],  
});

### **14.4 The PostCSS Configuration**

* **Constraint:** Every project MUST include a postcss.config.js in the root.

// postcss.config.js  
export default {  
  plugins: {  
    tailwindcss: {},  
    autoprefixer: {},  
  },  
}

### **14.5 The PM2 Ecosystem (Production Runtime)**

* **Constraint:** Use ecosystem.config.cjs to standardize the production environment.

// ecosystem.config.cjs  
module.exports \= {  
  apps: \[{  
    name: "velocity-app",  
    script: "server-entry.mjs",  
    interpreter: "node",  
    instances: "max", // Uses all cores (Cluster Mode)  
    exec\_mode: "cluster",  
    env: {  
      NODE\_ENV: "production",  
      PORT: 3000  
    }  
  }\]  
}

## **15\. Asset Management & PWA (Favicon)**

**Objective:** Standardize layout and delivery of static assets.

### **15.1 Directory Structure**

* **Root:** public/ (Must exist at project root).  
* **Mandatory Files:**  
  * favicon.ico  
  * favicon-16x16.png  
  * favicon-32x32.png  
  * apple-touch-icon.png  
  * manifest.json (Renamed from site.webmanifest)  
  * robots.txt

### **15.2 The PWA Manifest (CRITICAL)**

* **Constraint:** To ensure browsers trigger the "Install" prompt, manifest.json MUST contain the following fields with non-empty values:  
  * name: The full name of the application.  
  * short\_name: The name used on the home screen.  
  * start\_url: Must be set to / or the root path.  
  * display: Must be set to standalone.  
  * icons: At least one icon of size 144x144 or larger (standard 192x192 and 512x512).

### **15.3 Root Layout Implementation (routes/__root.tsx)**

* **Constraint:** The `routes/__root.tsx` file MUST utilize native HTML tags and TanStack components for robust SSR/Hydration.

```tsx
// routes/__root.tsx
import { createRootRoute } from '@tanstack/solid-router'
import { HeadContent, Scripts, HydrationScript, Outlet } from '@tanstack/solid-start'

export const Route = createRootRoute({
  component: () => (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <HydrationScript />
        <div id="app">
          <Outlet />
        </div>
        <Scripts />
      </body>
    </html>
  )
})
```


## **16\. The Router Mandate (Speed Configuration)**

**Objective:** Ensure "Instant Navigation" feel by configuring aggressive preloading.

* **Constraint:** In app/router.tsx (or where createRouter is defined), you **MUST** set the following defaults:

// app/router.tsx  
export function createRouter() {  
  return createTanStackRouter({  
    routeTree,  
    // CRITICAL: Preload data on hover (Intent) to mask latency  
    defaultPreload: 'intent',  
    // Cache data for 5 seconds to prevent waterfall refetches on rapid navigation  
    defaultStaleTime: 5000,   
    scrollRestoration: true,  
  })  
}  
