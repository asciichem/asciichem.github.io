# 38 — Resolver framework + cache

- **Priority:** P2
- **Status:** done — gem#59
- **Depends on:** 35 (identifier layer it builds on)
- **Implements:** TODO.v2 07 Layer 2

## Motivation

Resolution turns identifiers into substance records. The framework
must be multi-source with cross-checking (molecule-resolver
architecture) and must never write inside the gem install dir.

## Scope

- `AsciiChem::Resolver`: source-adapter registry (OCP), parallel
  query, cross-check mode with isotope/isomer/tautomer strictness,
  disagreement surfaced not hidden.
- Output populates `SubstanceRecord` (from 31); suggested annotations
  carry provenance; user formulas are never silently mutated.
- Cache in user cache dir; entries carry source, retrieved-at,
  attribution, TTL; `--no-cache`/`--refresh`.
- Config: opt-in sources (NC-licensed Common Chemistry never default —
  maintainer sign-off recorded in TODO.v2 07 before it ships).

## Acceptance

- Two adapters registered (39, 40); cross-check spec with recorded
  fixture responses; no network in CI tests (opt-in `rspec -t
  network`).
