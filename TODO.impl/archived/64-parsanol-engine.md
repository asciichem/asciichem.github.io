# 64 — Opt-in Parsanol engine (adoption)

- **Priority:** P2
- **Status:** done (2026-09-15) — shipped in asciichem 0.29.0
- **Depends on:** 63 (the re-check that met the revisit trigger)
- **Implements:** TODO.v2 11 (Rust core) in soft-dependency form

## Motivation

Re-check 4 (parsanol 1.3.16): native routing passed the ENTIRE
corpus (221/221) at 3.1× parslet on the recheck workload — the
recorded revisit trigger (native survives the grammar, beats
parslet, corpus green) was fully met.

## Design (OCP / MECE / single source of truth)

- Grammar and transform extracted into backend-neutral
  `GrammarRules` / `TransformRules` modules. `Grammar` and
  `Transform` stay the parslet reference classes;
  `Engine::ParsanolEngine::Grammar/Transform` are backend twins
  including the same rules. One rule set, two backends.
- `AsciiChem::Engine.use(:parsanol | :parslet)` selector; default
  `:parslet` (zero behavior change for every existing user);
  `ASCIICHEM_ENGINE` env selects for test runs (the seam that let
  the whole 1981-example suite run under the Rust core).
- Parsanol is a **soft dependency** — gemspec untouched (dependency
  decisions remain the maintainer's); absent gem raises
  `NotAvailableError` with install guidance.
- Engine divergence seam, engine-local: parsanol merges sibling node
  captures (and OVERWRITES same-key repeats — silently dropping
  bare-repeat cascade legs). The engine normalizes the merged
  formula hash back to parslet shape before the shared rules run;
  the cascade grammar wraps legs in one `:segments` repeat (the
  electron-config pattern) so every engine arrays them.

## Verification

- Full suite: **1981/0 under BOTH engines**
- Corpus gate: 221/221 under native
- Shipped-path benchmark (parse+transform): 219 vs 90 i/s (2.4×)
- Upstream follow-ups on parsanol-ruby#25: the merge/overwrite
  semantics and the H2/_2O acceptance divergence

## Acceptance

All met; released as 0.29.0 (PRs asciichem-ruby#77/#78).
