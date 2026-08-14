# `packages/shared` — `@marcy-nexus/shared`

← [back to overview](./00-overview.md)

## Why this package exists

Both the web app and the mobile app need to talk to the same Supabase project using
the same data shape. Without a shared package, "how do I build a Supabase client"
and "what does a database row look like in TypeScript" would each need writing
twice — once per app — and the two copies would inevitably drift apart the first
time either app changed independently.

This package holds exactly that shared surface area, and nothing platform-specific:
no React, no React Native, no Next.js, no browser or mobile-only APIs. Each app
supplies its own platform-specific pieces (its own env var names, its own auth
storage adapter) and calls into this package to do the actual client construction.
That boundary is deliberate — it's what keeps this package importable from both a
browser bundle and a React Native bundle without pulling in code that only makes
sense on one side.

npm workspaces is what makes this practical without extra tooling: because this
package lives under `packages/*` (declared as a workspace in the root
`package.json`), `npm install` at the repo root symlinks it into
`node_modules/@marcy-nexus/shared` automatically. Both apps `import` it exactly as
they would a real published npm package, but every edit here is picked up
immediately — nothing needs publishing or version-bumping during development.

## File-by-file

### `package.json`
Names the package `@marcy-nexus/shared` (the `@marcy-nexus/` scope keeps it visibly
distinct from real published npm packages), marks it `private` (it must never
actually be published to the public npm registry), and declares `main`/`types` as
pointing straight at `./src/index.ts` — there's no build step; consumers import the
TypeScript source directly, and Next.js/Expo's bundlers compile it as part of
compiling the app that imports it. Its one dependency is `@supabase/supabase-js`,
the official Supabase JS client.

### `tsconfig.json`
A standalone TypeScript config for this package (`target: ES2020`, `strict: true`,
`module`/`moduleResolution` set for modern bundler-based resolution). Exists mainly
so editors and `tsc` can type-check this package in isolation; the apps that consume
it apply their own `tsconfig.json` rules when actually compiling it as part of their
build.

### `src/supabaseClient.ts`
The core of this package: `createSupabaseClient(url, anonKey, options?)`, a thin
wrapper around Supabase's own `createClient`. It does two things beyond a bare
passthrough:

1. **Validates inputs up front** — throws a clear error ("check your `.env` file
   against `.env.example`") if either `url` or `anonKey` is missing, rather than
   letting Supabase's client fail later with a more confusing error deep inside a
   network request.
2. **Accepts an optional `options` object** — this is how mobile passes its
   `auth.storage` configuration (the `expo-sqlite`-backed `localStorage` polyfill)
   without this package needing to know anything about React Native at all. The web
   app simply omits `options` and gets Supabase's browser-appropriate defaults.

Deliberately does **not** read environment variables itself — `process.env.NEXT_PUBLIC_*`
and `process.env.EXPO_PUBLIC_*` are framework-specific concepts. Each app's own
`lib/supabaseClient.ts` reads its own env vars and passes the plain string values in.

### `src/types.ts`
Currently a placeholder: `Database = Record<string, unknown>`. Once the actual
Postgres schema exists in Supabase, the Supabase CLI can generate real, fully-typed
definitions (`supabase gen types typescript ...` — see
[04-supabase-backend.md](./04-supabase-backend.md)) into a new
`database.types.ts` file here, and this file gets updated to re-export the
generated `Database` type instead. Every place that imports `Database` from this
package updates automatically once that swap happens — no call sites need to
change.

### `src/index.ts`
The package's public surface. Re-exports `createSupabaseClient`, the
`SupabaseClient` type, and the `Database` type. Both apps import only from this file
(`@marcy-nexus/shared`) — never reaching into `src/supabaseClient.ts` or
`src/types.ts` directly — so this file is the one place that defines what's
considered "public API" versus internal implementation detail.
