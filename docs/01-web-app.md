# `apps/web` — Next.js Web App

← [back to overview](./00-overview.md)

## Why Next.js

Next.js was chosen (over a plain Vite + React SPA) because it gives a production
path with no extra setup: file-based routing, both server and client rendering,
image optimization, and a free/cheap deploy target (Vercel's free tier, or a static
export to any static host). It also has first-class docs and examples for pairing
with Supabase specifically.

This app was generated with `create-next-app@latest --ts --tailwind --eslint --app
--src-dir --import-alias "@/*"`, meaning: TypeScript, Tailwind CSS, ESLint, the App
Router (not the older Pages Router), a `src/` directory, and `@/*` as a shorthand
import path for anything under `src/`.

## What's actually generated vs. what we added

Everything except `.env.example` and `src/lib/supabaseClient.ts` was generated
automatically by `create-next-app`. Those two files are the only hand-written parts
of this app so far — this is currently a bare Next.js starter with Supabase wired in,
not yet a built-out product.

## File-by-file

### `package.json`
Declares this workspace's name (`web`), its scripts (`dev`, `build`, `start`,
`lint`), and its dependencies: `next`, `react`, `react-dom`, Tailwind and its
PostCSS plugin, ESLint and `eslint-config-next`, TypeScript, and (added by hand)
`@marcy-nexus/shared`. The `@marcy-nexus/shared` version is `*`, meaning "whatever
version exists in this workspace" — npm resolves it to the local `packages/shared`
folder via a symlink rather than downloading anything.

### `package-lock.json`
Exact, reproducible dependency tree for this workspace specifically (there's also
one at the repo root covering everything together). Committed so `npm install`
produces byte-identical `node_modules` on any machine.

### `tsconfig.json`
TypeScript compiler configuration. Notable settings: `moduleResolution: "bundler"`
(matches how Next.js's bundler actually resolves imports, rather than Node's older
resolution rules), `paths: { "@/*": ["./src/*"] }` (enables `import x from
"@/lib/supabaseClient"` instead of relative `../../lib/...` paths), and a `plugins`
entry for `next` which powers in-editor type-checking of things like route params.

### `next.config.ts`
The project-wide Next.js configuration file — currently empty (`{}`), a placeholder
for when the app needs custom behavior (redirects, headers, image domains,
`transpilePackages`, etc.). Notably, it does **not** need a `transpilePackages` entry
for `@marcy-nexus/shared`: Next.js 16 defaults to Turbopack, which auto-transpiles
workspace packages in a monorepo without any extra config.

### `next-env.d.ts`
Auto-generated TypeScript declaration file that wires up Next.js's ambient types.
Regenerated automatically on every `next dev`/`next build` — never edited by hand,
and the file itself says so.

### `eslint.config.mjs`
ESLint's flat-config format, extending `eslint-config-next`'s two rule sets
(`core-web-vitals` and `typescript`) and re-declaring the default ignore patterns
(`.next/`, `out/`, `build/`, `next-env.d.ts`). Next.js 16 removed the old `next lint`
command entirely, so linting now goes through plain `eslint` (see the `lint` script
in `package.json`).

### `postcss.config.mjs`
Registers the `@tailwindcss/postcss` plugin so Tailwind's `@import "tailwindcss"`
directive in `globals.css` gets processed at build time. Tailwind v4 uses this
plugin-based setup instead of the old `tailwind.config.js` file.

### `.env.example`
Template for the real environment file. Documents the two variables the app expects
— `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — without
containing real values, so it's safe to commit. Copy it to `.env.local` and fill in
real values to run the app against a real Supabase project.

### `.gitignore`
Next.js's standard ignore list: `node_modules`, `.next`/`out`/`build` (build
output), `.env*` (all env files, local overrides included), `.vercel`, and
`*.tsbuildinfo`.

### `README.md`
The default README `create-next-app` writes for every new project (how to run
`npm run dev`, links to Next.js docs, a note about deploying on Vercel). Left as-is;
the root-level `README.md` and this `docs/` folder are where Marcy-Nexus-specific
instructions live instead.

### `AGENTS.md` / `CLAUDE.md`
See "A note on the AGENTS.md / CLAUDE.md files" in
[00-overview.md](./00-overview.md). In short: auto-generated warnings that this
Next.js version (16.3.1) is newer than most AI models' training data, pointing at
the real bundled docs in `node_modules/next/dist/docs/` to read before writing
framework-specific code.

### `src/app/layout.tsx`
The App Router's **root layout** — every page in the app renders inside this
component. It loads two Google Fonts (Geist Sans and Geist Mono) via `next/font`
(which self-hosts and optimizes them rather than fetching from Google at runtime),
exposes them as CSS variables, and sets the page `<html>`/`<body>` structure and
`metadata` (page `<title>`/`<meta name="description">`) for the whole site.

### `src/app/page.tsx`
The **home page** (route `/`) — currently the default `create-next-app` starter
content (a Next.js logo, a "get started" message, links to Vercel/Next.js docs).
This is the first thing to replace with real Marcy Nexus content.

### `src/app/globals.css`
Global stylesheet. Pulls in Tailwind via `@import "tailwindcss"`, defines two CSS
custom properties (`--background`, `--foreground`) with a dark-mode override via
`prefers-color-scheme`, and maps them into Tailwind's theme via the `@theme inline`
block (Tailwind v4's mechanism for exposing custom properties as theme tokens like
`bg-background`).

### `src/app/favicon.ico`
Default Next.js favicon placeholder — swap for a real Marcy Nexus icon later.

### `src/lib/supabaseClient.ts` *(hand-written)*
The one Supabase-aware file in this app. Reads the two `NEXT_PUBLIC_*` env vars and
passes them into `createSupabaseClient` from `@marcy-nexus/shared`, exporting a
single `supabase` client instance for the rest of the app to import
(`import { supabase } from "@/lib/supabaseClient"`). Kept intentionally thin — all
the actual client-construction logic lives in the shared package so mobile can reuse
it too.

### `public/*.svg`
Static assets served as-is at the site root (e.g. `public/next.svg` → `/next.svg`).
All five (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) are
`create-next-app`'s default placeholder icons, used by the starter `page.tsx` —
safe to delete once that page is replaced with real content.

### `.next/` *(not committed — build output)*
Next.js's build/dev cache and generated type helpers (e.g.
`.next/types/routes.d.ts`, which powers typed route params like `LayoutProps<"/">`
used in `layout.tsx`). Regenerated on every `dev`/`build` run; never hand-edited or
committed.
