# `apps/mobile` — Expo (React Native) App

← [back to overview](./00-overview.md)

## Why Expo

Expo was chosen over "bare" React Native because it removes almost all native
Android/iOS toolchain setup for day-to-day development — you write TypeScript/React
and run it in the Expo Go app on a real phone or in a simulator, without touching
Xcode or Android Studio project files directly. It only becomes necessary to "eject"
into the bare native project structure if/when a feature needs a native module Expo
doesn't already support.

This app was generated with `create-expo-app@latest --template blank-typescript`,
the minimal TypeScript starter (no navigation library, no example screens beyond a
single placeholder), on **Expo SDK 57** (React Native 0.86).

## What's actually generated vs. what we added

Everything except `.env.example` and `lib/supabaseClient.ts` was generated
automatically. The `@supabase/supabase-js`, `expo-sqlite`, and
`react-native-url-polyfill` dependencies were added by hand via `npx expo install`
(the Expo-aware equivalent of `npm install` — see below).

## File-by-file

### `package.json`
Declares the workspace name (`mobile`), scripts (`start`, `android`, `ios`, `web` —
all wrappers around `expo start`), and dependencies. `expo`, `expo-status-bar`,
`react`, and `react-native` came from the template. `@supabase/supabase-js`,
`expo-sqlite`, and `react-native-url-polyfill` were added by hand (see
`supabaseClient.ts` below for why). `@marcy-nexus/shared` (version `*`) was added by
hand the same way as in the web app, resolving to the local `packages/shared` folder.

### `package-lock.json`
This workspace's exact dependency tree, same purpose as the web app's lockfile.

### `app.json`
Expo's app configuration: app name/slug, version, orientation (`portrait`), app
icon paths, iOS (`supportsTablet`), Android adaptive-icon image set, and the web
favicon path. This is what `eas build`/`expo prebuild` reads to generate the actual
native iOS/Android project scaffolding when the time comes to build a real app
binary — none of that native scaffolding exists yet in managed Expo development.

### `tsconfig.json`
Extends `expo/tsconfig.base` (Expo's recommended TypeScript defaults for React
Native) and turns on `strict` mode.

### `index.ts`
The actual JS entry point Metro (React Native's bundler) loads first. Calls
`registerRootComponent(App)` from the `expo` package, which — per its own inline
comment — registers the root component with React Native's `AppRegistry` and makes
sure the environment is set up consistently whether the app is running inside Expo
Go or a native build.

### `App.tsx`
The root React component. Currently the unmodified starter: a centered `<Text>`
placeholder and the status bar component. This is the mobile equivalent of
`src/app/page.tsx` in the web app — the first thing to replace with real UI.

### `lib/supabaseClient.ts` *(hand-written)*
The mobile equivalent of the web app's `src/lib/supabaseClient.ts`, but with two
mobile-specific requirements layered on:

- **`import 'react-native-url-polyfill/auto'`** — React Native's JS engine (Hermes)
  doesn't implement the full `URL` API that `@supabase/supabase-js` relies on
  internally; this polyfill patches it in globally before anything else runs.
- **`import 'expo-sqlite/localStorage/install'`** — Supabase's auth client needs a
  persistent key-value store to keep the user's session alive across app restarts.
  On web this is just `localStorage`; React Native has no built-in equivalent. The
  currently Expo-recommended approach (superseding the older
  `@react-native-async-storage/async-storage` pattern) is `expo-sqlite`'s
  `localStorage` polyfill, which installs a global `localStorage`-shaped API backed
  by real SQLite storage on native platforms. That's what gets passed as
  `auth.storage` when constructing the client.

Reads `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` and calls the same
`createSupabaseClient` factory from `@marcy-nexus/shared` that the web app uses.

### `.env.example`
Template for `apps/mobile/.env`, documenting `EXPO_PUBLIC_SUPABASE_URL` and
`EXPO_PUBLIC_SUPABASE_ANON_KEY`. The `EXPO_PUBLIC_` prefix is Expo's equivalent of
Next.js's `NEXT_PUBLIC_` — only variables with this prefix get inlined into the
compiled JS bundle; anything else stays server/build-machine-only and is invisible
to the running app.

### `.gitignore`
Expo's standard ignore list: `node_modules`, `.expo/` (local dev server cache),
`dist`/`web-build` (export output), generated native folders (`/ios`, `/android` —
these only appear after running `expo prebuild`/ejecting, and are regenerated from
`app.json` rather than hand-maintained), and `.env*.local`.

### `AGENTS.md` / `CLAUDE.md`
Same purpose as the web app's — auto-generated pointer to the real Expo SDK 57
versioned docs (`https://docs.expo.dev/versions/v57.0.0/`), since SDK 57 is newer
than most AI models' training data and has real behavioral changes (e.g. the storage
adapter change described above, and the New Architecture being mandatory since
SDK 55).

### `LICENSE`
The MIT license text for the `create-expo-app` template itself (copyright 650
Industries, Inc., the company behind Expo) — a boilerplate file the generator
includes automatically, not a license statement about this project's own code.

### `assets/`
Static image assets referenced from `app.json`: the app icon (`icon.png`), splash
screen icon (`splash-icon.png`), Android adaptive-icon layers (foreground,
background, monochrome), and the web favicon. All placeholder graphics from the
template — swap for real Marcy Nexus branding when available.

### `.claude/settings.json`
Enables the `expo` Claude Code plugin for this workspace (`"expo@claude-plugins-official": true`).
This is unrelated to app runtime behavior — it's tooling configuration that gives
Claude Code (when working inside this specific folder) access to Expo-specific
assistance features. Auto-generated by `create-expo-app`, not something the app
itself depends on.
