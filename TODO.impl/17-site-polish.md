# 17 — Site polish: search, OG, a11y, visual tests

- **Priority:** P3
- **Status:** pending
- **Depends on:** 09, 11

## Motivation

Starlight ships with Pagefind search built in. We still need OG images
for social sharing, an accessibility audit, link checking, and visual
regression for the rendered AsciiChem examples (the rendered MathML is
the project's defining visual — it must not regress silently).

## Scope

- OG images: `scripts/generate-og.mjs` — for each doc page, render title
  + tagline to PNG via `satori` or `sharp`. Starlight has its own OG
  pattern; follow it.
- A11y: `scripts/accessibility-audit.mjs` using `@axe-core/playwright`.
  Every page must pass WCAG 2 AA.
- Link check: `scripts/validate-links.mjs` — crawl built HTML, assert no
  internal 404s.
- Visual regression: `playwright.config.ts` + `tests/visual.spec.ts` —
  snapshot every page with rendered AsciiChem examples in light and dark
  mode. Diffs require explicit review.
- Vitest unit specs for any JS in `src/scripts/` or `src/lib/`.

## Acceptance

- `npm run check:a11y` — 0 violations on all pages.
- `npm run check:links` — 0 broken internal links.
- `npm run test:visual` — all baselines present, no unexpected diffs.
- `npm test` — all Vitest specs pass.
