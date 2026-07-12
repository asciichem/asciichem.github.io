# 23 — Visual regression baselines

- **Priority:** P3
- **Status:** pending (infrastructure present; baselines not captured)
- **Depends on:** 09, 10

## Motivation

The site renders MathML produced by the gem. If a formatter change
shifts the visual output, we want to know before deploying. Visual
regression snapshots catch CSS/markup drift that text diffing misses.

## Scope

- `playwright.config.ts` — configures Playwright for the site's
  preview server.
- `tests/visual.spec.ts` — for each page in the sitemap, snapshot:
  - light mode
  - dark mode
  - mobile viewport (375px)
  - desktop viewport (1280px)
- Baselines stored in `tests/visual/baselines/<page>-<mode>-<viewport>.png`.
- CI runs visual regression on every PR; diffs > threshold fail.
- Baseline updates require explicit `npx playwright test --update-snapshots`.

The infrastructure is in place; the first run captures baselines.
Browser binary install (~100 MB) is a one-time cost documented in
`scripts/install-playwright.mjs`.

## Acceptance

- `npx playwright test` runs the visual regression suite.
- All pages have baselines.
- CI workflow runs visual regression and uploads diff artifacts on
  failure.
