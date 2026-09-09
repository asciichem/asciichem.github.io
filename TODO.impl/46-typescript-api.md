# 46 — TypeScript API (`asciichem-ts`)

- **Priority:** P2
- **Status:** pending (blocked on 36 ADR)
- **Implements:** TODO.v2 05

## Motivation

The site is Astro/TS but shells out to the gem at build time; a
conformant TS API gives the ecosystem a JS entry point under the
single-contract rule (same corpus as Ruby).

## Scope

- New repo `asciichem-ts` (npm `asciichem`): types generated from
  `asciichem-model` schemas (32's generator, CI drift check); PEG
  parser (peggy) mirroring the Ruby grammar incl. prefix-isotope
  binding; model with semantic equality; canonical JSON in/out.
- Formatters phased: Text + MathML (L1/L2) → HTML/LaTeX → CML (L3).
  SVG/2D out of scope until the Rust/WASM question resolves.
- Vitest conformance runner over `asciichem-tests` (vendored or CI
  fetch), claiming levels in `conformance.json`.
- Site build-time Ruby shell-out retained until L3, then a deliberate
  switch PR; client-side playground route may come earlier (51).
- Later phase: interchange (42/43) and identifier validators (35)
  ported corpus-first.

## Acceptance

- L0–L2 at 100% of corpus; round-trip property `parse(s).toText() ===
  s` for all `roundTrip` cases; CI emits conformance.json.
