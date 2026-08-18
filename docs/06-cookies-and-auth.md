# Cookies & Session Handling

← [back to overview](./00-overview.md)

This doc answers one question precisely: **does the app use cookies, and why.**
It covers what's actually implemented today — the session-cookie plumbing — as
distinct from [05-roles-and-data-model.md](./05-roles-and-data-model.md), which
covers the *roles and RLS policies* that will eventually consume that session
(not yet implemented — no `user_roles` table exists yet).

## Short answer

**Yes.** `apps/web` stores the Supabase session in a cookie, not `localStorage`.
This is implemented in three files:

- [`src/lib/supabase/client.ts`](../apps/web/src/lib/supabase/client.ts) — for
  Client Components (`"use client"` files running in the browser).
- [`src/lib/supabase/server.ts`](../apps/web/src/lib/supabase/server.ts) — for
  Server Components, Server Actions, and Route Handlers.
- [`src/lib/supabase/proxy.ts`](../apps/web/src/lib/supabase/proxy.ts) — invoked
  by [`src/proxy.ts`](../apps/web/src/proxy.ts) on (almost) every request.

No login UI exists yet, so nothing sets this cookie in practice today — but the
mechanism is in place for when auth work starts.

## Why cookies instead of `localStorage`

`@supabase/supabase-js` on its own (what the old `apps/web/src/lib/supabaseClient.ts`
used, now removed) defaults to storing the session in the browser's
`localStorage`. That's simple and works fine for a client-only single-page app,
but it has one hard limitation: **the Next.js server cannot read `localStorage`**
— it doesn't exist outside a browser tab.

That matters here because of role-based page gating
([05-roles-and-data-model.md](./05-roles-and-data-model.md)): to keep, say,
`/admin` from ever rendering for a non-admin, that check has to happen **before**
the page renders, on the server — in Next.js's `proxy.ts` (the file Next.js 16
runs before every route; see [Migration to Proxy](#a-note-on-proxyjs-vs-middlewarejs)
below) and in Server Components. Neither can see `localStorage`.

`@supabase/ssr` solves this by storing the session in an **HTTP-only cookie**
instead. Cookies are sent with every request, so:

- `src/proxy.ts` can read the session cookie and decide to redirect/block a
  request before any page code runs.
- Server Components and Route Handlers ([`server.ts`](../apps/web/src/lib/supabase/server.ts))
  can read the same cookie to run Supabase queries under the logged-in user's
  identity — which is what makes Postgres RLS policies apply correctly even on
  server-rendered pages.
- The browser client ([`client.ts`](../apps/web/src/lib/supabase/client.ts)) reads
  and writes the *same* cookie, so navigating between a Client Component and a
  server-rendered page doesn't lose the session.

## How the three files fit together

```
Browser request
      │
      ▼
src/proxy.ts  ──calls──▶  updateSession() in lib/supabase/proxy.ts
      │                        - reads the session cookie off the request
      │                        - calls supabase.auth.getUser() to revalidate/
      │                          refresh it against Supabase's Auth server
      │                        - writes the (possibly refreshed) cookie back
      │                          onto the response
      ▼
Route renders (Server Component, Route Handler, or Client Component)
      │
      ├─ Server-side code calls lib/supabase/server.ts's createClient()
      │  → reads the now-fresh cookie via next/headers
      │
      └─ Client-side code calls lib/supabase/client.ts's createClient()
         → reads/writes the same cookie via document.cookie
```

Without `src/proxy.ts` refreshing the session on every request, an expired
access token would only get refreshed the next time a Client Component happened
to call Supabase — leaving Server Components looking at a stale or expired
session in the meantime. This is the standard pattern Supabase documents for
Next.js App Router, not a custom scheme.

## Local development without Supabase configured

`src/lib/supabase/proxy.ts` checks for `NEXT_PUBLIC_SUPABASE_URL` /
`NEXT_PUBLIC_SUPABASE_ANON_KEY` before doing anything, and passes the request
through untouched if they're missing:

```ts
if (!url || !anonKey) {
  return response;
}
```

This is what keeps `npm run dev:web` working with no `.env.local` at all (see
the root [README.md](../README.md)) — proxy runs on every request by design
(Next.js requirement), but there's nothing to refresh a session against until a
real Supabase project is linked. Once `.env.local` has real values, this
short-circuit stops applying automatically — no code change needed.

## A note on `proxy.js` vs `middleware.js`

Next.js 16 renamed the `middleware.js` file convention to `proxy.js` — same
mechanism (runs before a route renders, reads/writes cookies, can redirect),
new name and export (`export function proxy` instead of `export function
middleware`). This project was scaffolded on Next.js 16.3.1, so
[`src/proxy.ts`](../apps/web/src/proxy.ts) uses the current convention directly.
If a tutorial or AI-generated snippet mentions `middleware.ts`, it's describing
the pre-16 convention — see
`apps/web/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`
for the source of truth on this Next.js version specifically (per the
[`AGENTS.md` note](./01-web-app.md#agentsmd--claudemd) about this version being
newer than most models' training data).

## What still isn't built

This doc only covers the session/cookie transport layer. Still missing, and
covered instead by [05-roles-and-data-model.md](./05-roles-and-data-model.md):

- Actual login/signup UI and Supabase Auth configuration.
- The `profiles` / `user_roles` tables and the Auth Hook that stamps a role
  onto the JWT.
- Route gating logic inside `src/proxy.ts` / `updateSession()` that actually
  checks that role and redirects — right now it only refreshes the session,
  it doesn't yet block anything.

## Mobile: no cookies, and that's correct

`apps/mobile` doesn't use any of this — it isn't server-rendered, so there's no
server that needs to read a session out-of-band. When mobile auth is built, it
should use plain `@supabase/supabase-js` (already a dependency) with React
Native's `AsyncStorage` as the storage adapter, per
[02-mobile-app.md](./02-mobile-app.md). Cookies are a web/SSR-specific solution
to a problem mobile doesn't have.
