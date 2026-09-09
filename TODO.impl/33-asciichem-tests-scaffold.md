# 33 — `asciichem-tests` repo scaffold (corpus format + runner contract)

- **Priority:** P1
- **Status:** pending
- **Depends on:** 29 (schema forms)
- **Implements:** TODO.v2 02

## Motivation

The gem's test assets are Ruby-shaped. Conformance across Ruby/TS/PY
requires a language-neutral corpus with a defined runner contract —
the CommonMark/WPT pattern; the corpus is the spec's teeth.

## Scope

- New repo `~/src/asciichem/asciichem-tests` (data + docs only).
- Fixture format (JSON, one case or group per file): `id`, `input`,
  `parses`, `model` (canonical wire form), `renders` (text/mathml/cml
  goldens), `roundTrip`, `lint` (expected diagnostics), `tags`,
  `since`.
- Conformance levels: L0 parse/serialise, L1 Text round-trip, L2
  MathML golden, L3 CML round-trip, L4 linter diagnostics, L5 SVG
  (visual, optional); later: interchange levels (42/43).
- Runner contract (one page): iterate fixtures, compare model JSON by
  semantic equality, compare renderings, emit `conformance.json`
  (`implementation`, `version`, `corpusVersion`, per-level pass/total,
  `timestamp`).
- Reference runner in Ruby first (exercised by the gem in 37).

## Acceptance

- Repo scaffolded; fixture format + runner contract documented;
  conformance.json schema defined; CI placeholder green.
