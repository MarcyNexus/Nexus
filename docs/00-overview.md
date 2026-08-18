# Marcy Nexus — Project Structure & Rationale

This is the entry point for the documentation set in `docs/`. It explains **why** the
project is shaped the way it is, then hands off to one file per area of the codebase
for the file-by-file detail:

- [01-web-app.md](./01-web-app.md) — `apps/web` (Next.js)
- [02-mobile-app.md](./02-mobile-app.md) — `apps/mobile` (Expo / React Native)
- [03-shared-package.md](./03-shared-package.md) — `packages/shared`
- [04-supabase-backend.md](./04-supabase-backend.md) — `supabase/` and the backend itself
- [05-roles-and-data-model.md](./05-roles-and-data-model.md) — proposed roles, RBAC, and data model (not yet implemented)
- [06-cookies-and-auth.md](./06-cookies-and-auth.md) — cookie-based session handling (implemented) that the roles/RLS design above will build on
- [07-database-schema.md](./07-database-schema.md) — the actual migration file implementing the roles/data model design (written, not yet applied to the hosted project)
- [08-fellow-dashboard.md](./08-fellow-dashboard.md) — `/fellow`, reached via the Navbar's Community dropdown, publicly viewable with mock content data (not gated by login, by design)
- [09-alumni-dashboard.md](./09-alumni-dashboard.md) — `/alumni`, same conventions as `/fellow`; no migration written yet for its data
- [10-partner-portal.md](./10-partner-portal.md) — `/partner`, the external hiring-partner-contact role's portal; same conventions, no migration written yet

---

## Why this shape at all?

The app is one product (Marcy Nexus) that needs to run in **two places** — a browser
and a phone — and both need to talk to the **same backend** (Supabase) using the
**same data model**. Three structural decisions follow directly from that:

1. **One repo, not two or three.** If the web app and mobile app lived in separate
   repos, every shared concept (how to talk to Supabase, what a `Database` type looks
   like, business logic that isn't UI) would have to be copy-pasted and would drift
   out of sync the moment one side changed. A single repo lets both apps import from
   one shared package and see the same code at the same commit.

2. **npm workspaces, not a separate monorepo tool.** Tools like Turborepo or Nx add
   real value at scale (caching, task graphs, remote execution), but for a
   two-app-plus-a-shared-package project they're overhead you don't need yet. npm
   (which you already have) has workspace support built in as of npm 7+: it symlinks
   local packages into `node_modules` for you and lets one `npm install` at the root
   set up everything. That's the entire feature set this project currently needs.

3. **A `packages/shared` package instead of duplicated code.** Rather than each app
   having its own copy of "how do I create a Supabase client," there's one factory
   function both apps call with their own platform-specific config. See
   [03-shared-package.md](./03-shared-package.md) for the full reasoning.

## Why these specific technology choices

These were explicit decisions made with you (not defaults picked silently):

| Decision | Choice | Why |
|---|---|---|
| Backend | **Supabase** (over Firebase) | Real Postgres (relations, SQL, row-level security) instead of Firestore's NoSQL; Edge Functions included free with no forced paid-plan upgrade for server-side logic. Trade-off accepted: free-tier projects pause after 7 days idle and need a manual restart. |
| Web framework | **Next.js** (App Router) | React framework with a mature Supabase integration story, and a straightforward free deploy path (Vercel, or static export to Firebase/other static hosts). |
| Mobile framework | **Expo (React Native)** | Lets the web and mobile teams share one language (TypeScript) and largely one mental model, with far less native-toolchain setup than bare React Native. |
| Package manager | **npm** | Already installed, zero extra tooling, workspaces feature is sufficient for this project's size. |
| Node version | **24.x LTS** (via nvm-windows) | The machine had Node 16.17.1, which is end-of-life and too old for current Next.js (needs 18.18+/20+) or current Expo SDKs (needs 18+). Node 20 LTS itself has since reached end-of-life (April 2026), so 24.x — the current Active LTS as of August 2026 — was installed instead. `nvm-windows` was added first so future version switches don't require reinstalling Node from scratch. |

## Full directory tree

```
marcy-nexus/
├── .git/                       Git repository root (scoped to this folder only —
│                                see "A note on git scope" below)
├── .gitignore                  Root-level ignore rules (node_modules, .env files, OS cruft)
├── .env                        Server-only secrets (Supabase secret key). Gitignored — never committed.
├── README.md                   Quick-start instructions (setup, running, Supabase linking)
├── package.json                Root workspace manifest — declares apps/* and packages/*
│                                as npm workspaces; holds convenience scripts (dev:web, etc.)
├── package-lock.json           Single lockfile covering the whole workspace tree
├── node_modules/                 Hoisted dependencies shared by all workspaces, PLUS the
│   └── @marcy-nexus/shared      symlink npm creates so apps can `import` the shared
│                                package as if it were published to npm
│
├── apps/
│   ├── web/                    Next.js app — see 01-web-app.md
│   └── mobile/                 Expo app — see 02-mobile-app.md
│
├── packages/
│   └── shared/                 @marcy-nexus/shared — see 03-shared-package.md
│
├── supabase/                    Supabase CLI project config — see 04-supabase-backend.md
│
└── docs/                        You are here.
```

## A note on git scope

`C:\Users\Sager` itself appears to already be tracked as a git repository (visible in
this machine's git status from outside this project). `marcy-nexus/` has its **own**,
separate `git init` — nested inside but functioning as an independent repository
boundary. Git does not descend into a directory that itself contains a `.git` folder,
so this project's history stays self-contained and won't get mixed into (or
accidentally commit alongside) whatever is happening in the home-directory repo.

## A note on the `AGENTS.md` / `CLAUDE.md` files inside `apps/web` and `apps/mobile`

These were **not** written by hand — `create-next-app` and `create-expo-app`
generated them automatically because the scaffolded Next.js (16.3.1) and Expo (SDK 57)
versions are newer than most AI coding assistants' training data. They're a pointer
for any AI agent working in this repo to go read the *actual, current* bundled docs
(`node_modules/next/dist/docs/` or the Expo SDK 57 versioned docs) before writing
framework-specific code, rather than relying on possibly-outdated assumptions about
how that framework works. `CLAUDE.md` in each app is just a one-line include of
`AGENTS.md`, since Claude Code reads `CLAUDE.md` by convention. They're harmless to
commit and are there entirely for future-you (or future-agent) safety.

## A note on secrets and where each key lives

Supabase issues two kinds of API keys:

- **Publishable key** (`sb_publishable_...`) — safe to expose in client-side code.
  Goes into `apps/web/.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY` and
  `apps/mobile/.env` as `EXPO_PUBLIC_SUPABASE_ANON_KEY`. The `NEXT_PUBLIC_`/
  `EXPO_PUBLIC_` prefixes are what tell each framework's bundler "it's fine to ship
  this to every browser/phone that loads the app."
- **Secret key** (`sb_secret_...`) — full server-side privileges, bypasses Row Level
  Security. This one lives **only** in the root `marcy-nexus/.env` file — outside
  both apps, where no client bundler will ever pick it up — never in a
  `NEXT_PUBLIC_`/`EXPO_PUBLIC_` variable, and never committed (it's covered by the
  root `.gitignore`).

See [04-supabase-backend.md](./04-supabase-backend.md) for more on how these are used.
