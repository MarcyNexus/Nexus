# Marcy Nexus

Web + mobile app, backed by Supabase (free tier).

📖 **For a detailed, file-by-file explanation of what everything in this repo is and why it exists, see [docs/00-overview.md](./docs/00-overview.md).**

## Structure

```
marcy-nexus/
├── apps/
│   ├── web/       Next.js (App Router, TypeScript, Tailwind)
│   └── mobile/    Expo (React Native, TypeScript)
├── packages/
│   └── shared/    @marcy-nexus/shared — platform-agnostic Supabase client factory + shared types
└── supabase/      Supabase CLI project config (config.toml)
```

npm workspaces tie the three packages together — a change in `packages/shared` is picked up by both apps without publishing anything.

## Prerequisites

- Node.js 24.x LTS (managed via `nvm-windows`; run `nvm use 24.19.0` if you switch versions)
- A free [Supabase](https://supabase.com) project

## Setup

```bash
npm install
```

Copy the env examples and fill in your Supabase project's URL + anon key (Project Settings → API in the Supabase dashboard):

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
```

## Running

Run these from the **repo root** (not from `apps/web`) — npm workspaces resolve the
scripts to the right app.

```bash
npm run dev:web       # Next.js dev server → open http://localhost:3000
npm run dev:mobile    # Expo dev server (scan the QR code with Expo Go, or press a/i/w)
```

`npm run dev:web` doesn't require a real Supabase project to boot — the site loads
and renders fine without `.env.local` (the session-refresh logic in `src/proxy.ts`
detects missing credentials and no-ops instead of crashing). You only need real
Supabase credentials once you start wiring up auth or database calls — see
[docs/06-cookies-and-auth.md](./docs/06-cookies-and-auth.md) for how sessions are
handled once you do.

## Supabase

The `supabase/` directory holds CLI project config for local development and migrations.

```bash
npx supabase login             # one-time
npx supabase link --project-ref <your-project-ref>
npx supabase db pull           # pull remote schema down
```

Once you have a real schema, generate typed database types into the shared package:

```bash
npx supabase gen types typescript --project-id <your-project-ref> > packages/shared/src/database.types.ts
```

then update `packages/shared/src/types.ts` to re-export `Database` from that generated file.
