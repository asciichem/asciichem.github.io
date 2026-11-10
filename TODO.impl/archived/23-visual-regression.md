# 23 — Visual regression baselines

- **Priority:** P3
- **Status:** done (2026-09-16) — component suite enforced; full-page quarantined with evidence (PR #53)
- **Depends on:** 09, 10

## Motivation

The site renders MathML produced by the gem. If a formatter change
shifts the visual output, we want to know before deploying. Visual
regression snapshots catch CSS/markup drift that text diffing misses.

## What shipped

- **Enforced: component-scoped suite** (`tests/visual/pages.spec.ts`,
  7 surfaces × light/dark/mobile = 21 ubuntu-canonical baselines,
  committed): LiveDiff three-pane hero with rendered output,
  conformance matrix, playground renderer, per-language "you are
  here" lane highlight. Stable across every CI run.
- **CI** (`.github/workflows/visual.yml`): build → preview →
  Playwright on ubuntu; bootstrap mode generates baselines
  (write-and-pass) when none are committed, comparison mode enforces
  otherwise; artifacts always uploaded.
- **Quarantined: full-page suite** (the original `visual.spec.ts`
  scope below, never CI-run before): behind `FULLPAGE_VISUAL=1`.
  Identical commits produce full-page heights varying 100–570px
  run-to-run on shared runners — fonts awaited
  (`document.fonts.ready`), dynamic MathML paint hidden, still 12
  failures across 6 pages across three diagnostic rounds. Full-page
  diffing on shared runners is not bit-stable; component scope is.
- `npm run test:visual` / `test:visual:update`.

## Original scope (superseded)

- For each page in the sitemap: light/dark × mobile/desktop
  full-page snapshots, CI-enforced. The matrix above explains why
  this is opt-in rather than enforced.

## Acceptance

- [x] `npx playwright test` runs the enforced component suite
- [x] Ubuntu-canonical baselines committed; CI green against them
- [x] Full-page nondeterminism measured and documented, suite
      opt-in rather than silently flaky
