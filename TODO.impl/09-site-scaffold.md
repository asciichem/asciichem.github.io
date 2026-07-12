# 09 — Astro site scaffold (Starlight + Tailwind 4 + MDX)

- **Priority:** P1 (foundation)
- **Status:** pending
- **Depends on:** nothing (parallel with gem)
- **Blocks:** 10, 11, 12

## Motivation

A spec needs a home. Starlight gives us docs layout, sidebar, search,
themes, and MDX for free. Tailwind 4 (via Vite 8) layers on custom design
tokens for the AsciiChem brand.

Per the user's direction: Astro 7, Vite 8, Tailwind 4 (via Vite plugin),
Starlight, MDX. Site deploys to `www.asciichem.org` from this repo.

## Scope

- `package.json` — pinned to `astro@^7`, `vite@^8`,
  `@astrojs/starlight@latest`, `@astrojs/mdx`, `@tailwindcss/vite@^4`,
  `tailwindcss@^4`. Scripts: `dev`, `build`, `preview`, `check`, `test`
  (vitest).
- `astro.config.mjs`:
  - `site: 'https://www.asciichem.org'`
  - Starlight integration with title `AsciiChem`, logo, sidebar config
    referencing `src/content/docs/`.
  - MDX integration.
  - Vite plugin: `@tailwindcss/vite`.
- `src/content.config.ts` — Starlight docs collection (the
  `@astrojs/starlight` schema), plus a custom `examples` collection for
  AsciiChem snippets that render via the gem.
- `src/styles/app.css` — single CSS entry: Tailwind 4 `@import
  "tailwindcss"` plus `@theme { ... }` tokens for the brand palette,
  plus global styles (code blocks, MathML display, reaction arrows).
- `tsconfig.json` — `extends: "astro/tsconfigs/strict"`, path aliases
  `@/*`, `@components/*`, `@lib/*`.
- `public/CNAME` — `www.asciichem.org`.
- `public/favicon.svg`.
- `.github/workflows/deploy-pages.yml` — build with `npm run build`,
  upload `dist/` as Pages artifact.

Starlight provides the layout. We do **not** roll our own BaseLayout /
DocLayout — that's the Primmel pattern, but the user picked Starlight, so
Starlight owns the chrome.

## Acceptance

- `npm install` succeeds with the pinned versions.
- `npm run dev` serves the site locally.
- `npm run build` produces `dist/` with the home page rendered.
- `npm run check` (astro check) reports 0 errors.
- CNAME present so Pages serves under `www.asciichem.org`.
