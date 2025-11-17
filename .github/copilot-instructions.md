<!-- Copilot / AI-agent guidance for the `btw-frontend` repo -->

# Repo Snapshot

- Framework: Next.js (app router) using `app/` with TypeScript and React.
- Next version: `16.x` (see `package.json`). React `19.x`.
- Styling: TailwindCSS (see `postcss.config.mjs` and `app/globals.css`).
- Fonts: `next/font/google` usage (see `app/layout.tsx` — `Geist` family).

# Quick commands

- Dev server: `npm run dev` (runs `next dev`).
- Build: `npm run build` (runs `next build`).
- Start (production): `npm run start` (runs `next start`).
- Lint: `npm run lint` (invokes `eslint`).

# Architecture & important patterns

- App Router: The app uses the Next.js `app/` directory. Files under `app/` (e.g. `app/page.tsx`, `app/layout.tsx`) follow the app-router conventions — prefer colocated routes, layouts, and server components by default.
- Server vs Client components: Files are TSX; components are server components unless they include a `"use client"` directive. Don't add browser-only APIs (e.g. localStorage, window) to server components.
- Global styles: `app/globals.css` is included from `app/layout.tsx`. Tailwind utilities are used throughout — prefer Tailwind classes for styling rather than ad-hoc CSS.
- Fonts: Project uses `next/font/google` in `app/layout.tsx` (Geist). Keep font setup in layout unless a component requires a different font.
- TypeScript path alias: `tsconfig.json` maps `@/*` to `./*`. Use imports like `import X from "@/components/X"`.

# Project-specific conventions

- File locations: add routes/pages under `app/` (e.g. `app/dashboard/page.tsx`).
- Small UI and layout code lives in `app/` alongside route files; create a `components/` or `ui/` folder at repo root or under `app/` as needed and import with the `@/` alias.
- Prefer functional components and TypeScript types/interfaces. `strict: true` is enabled in `tsconfig.json`.

# Linting and formatting

- `npm run lint` runs `eslint` (see `eslint.config.mjs`). If you add new lint rules or plugins, update `package.json` and `eslint.config.mjs` accordingly.

# Integration points & external dependencies

- Hosting: README suggests Vercel deployment; Next.js defaults are compatible with Vercel. Keep serverless-friendly APIs (no long-running local servers).
- Tailwind plugin: `@tailwindcss/postcss` and `tailwindcss` are in devDependencies — check `postcss.config.mjs` for pipeline.

# Files you should inspect when changing behavior

- `package.json` — scripts and dependency versions.
- `tsconfig.json` — path aliases and strictness flags.
- `app/layout.tsx` — global layout, fonts, and where global CSS is imported.
- `app/page.tsx` — example route and Tailwind usage.
- `next.config.ts` — project-specific Next config (currently minimal).
- `postcss.config.mjs` and `globals.css` — PostCSS/Tailwind pipeline and global styles.
- `eslint.config.mjs` — linting rules and plugin config.

# Examples (copyable)

- Import using alias: `import Button from "@/components/Button";`
- Start dev server: `npm run dev`
- Build for prod: `npm run build && npm run start`

# Notes / gotchas discovered in repo

- There are no test scripts present in `package.json`. If you add tests, add a script like `test` and mention preferred runner (Vitest / Jest).
- `lint` script calls `eslint` without a path — CI or local runs might need `npx eslint .` if ESLint CLI requires arguments.

# When editing this file

- Preserve the short commands and the set of file references above. If you add major frameworks or change routing conventions, update the Architecture section to reflect the new shape.

---
If any area above is unclear or you'd like me to expand specific parts (routing examples, recommended component structure, or CI hints), tell me which section to iterate on.
