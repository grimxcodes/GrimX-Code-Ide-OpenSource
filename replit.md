# GrimX - Coding IDE

A full VS Code-like coding IDE for Android built with Expo, featuring a 3D-animated Grim Reaper character and a dramatic black/grey/shining-red theme.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Mobile: Expo ~54, React Native 0.81, Expo Router v6

## Where things live

- `artifacts/mobile/` — Expo mobile app (GrimX IDE)
- `artifacts/mobile/app/` — Expo Router screens (intro, onboarding, questions, permissions, editor)
- `artifacts/mobile/components/` — UI components (ActivityBar, TabBar, FileTree, MonacoEditor, GrimReaper, etc.)
- `artifacts/mobile/context/` — AppContext (settings/onboarding), EditorContext (files/tabs/panels)
- `artifacts/mobile/constants/colors.ts` — GrimX dark color tokens (always dark, identical light/dark keys)
- `artifacts/mobile/hooks/useColors.ts` — `useColors()` hook for design tokens

## Architecture decisions

- Monaco Editor is embedded via WebView with CDN (requires internet) — `buildHTML()` in MonacoEditor.tsx generates the full HTML string
- GrimReaper SVG uses `react-native-svg` for internals with `setInterval` for eye glow (not Reanimated for SVG), and `Animated.View` wrapper for float
- Tab switching uses `key={activeTab}` on MonacoEditor to force WebView remount — simpler than bidirectional sync
- Auto-save debounced 1.5s after content changes
- Onboarding flow: intro → onboarding → questions → permissions → editor (redirects based on AsyncStorage flag)
- Files persisted to AsyncStorage under `@grimx_files`; custom changes merged over DEFAULT_FILES

## Product

- Dramatic animated intro screen with falling code particles and rising Grim Reaper
- 3-slide horizontal onboarding, setup questions, permissions screen
- VS Code-like IDE: ActivityBar, File Explorer, Search, Git Panel, Extensions Marketplace, Tab Bar, Breadcrumb, Monaco Editor, Integrated Terminal, Command Palette, Status Bar

## User preferences

- Color scheme: black (#0d0d0d background), grey (#1a1a1a surfaces), shining red (#CC0000 primary)
- Never hardcode hex values in components except MonacoEditor HTML string

## Gotchas

- Reanimated hook-using components must be top-level (not inside maps/conditions): always extract as separate components
- `pnpm run typecheck` must be run from workspace root, not inside mobile folder
- Package versions must match Expo SDK — use `expo install` or pin to expected versions
- `react-native-webview@13.15.0` and `expo-notifications@~0.32.17` are pinned for Expo 54 compatibility

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
