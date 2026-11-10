# 53 — Site: live renderer (asciichem-ts) + /models page

- **Priority:** P2
- **Status:** done
- **Repos:** asciichem.github.io, asciichem-ts

## What

- `asciichem-ts` created (npm package `asciichem`, strategy A per
  ADR-0001): peggy port of the reference grammar, transform, visitor
  model, Text canonicaliser, typographic SVG, deterministic 2D
  structural renderer (RingBonds port; rings as regular polygons,
  chains as zigzags), canonical wire JSON with vendored
  asciichem-model v1 types. Conformance: parse/reject, L0, L1 at
  100% of the corpus (378 corpus tests + 66 unit tests; CI clones
  corpus + model).
- Site `/playground` gains a **live renderer**: client-side parse +
  render through the package, with Diagram / Typography / Text /
  Wire JSON modes and presets. This is the sanctioned early
  client-side integration (TODO.v2 05): correctness-critical static
  examples keep the build-time Ruby pipeline until the TS API claims
  L3.
- Site `/models` page documents **asciichem-model**: schema
  inventory, wire-form example, versioning/vendoring, per-language
  consumption, conformance corpus links.

## Decisions

- SVG rendering moved IN SCOPE for asciichem-ts by maintainer
  instruction (TODO.v2 05 had deferred it pending the Rust/WASM
  question; the revisit trigger "site wants client-side parsing"
  fired and the corpus-conformant TS path was chosen).
- Structural diagrams render only authored bonds/rings; bare
  formulas fall back to typographic rendering because a formula does
  not determine a structure (isomerism). Structure from databases
  arrives via the identifier/interchange track (TODO.v2 07/09/39/40).

## Follow-ups

- TODO 54 (games' inline parser migration).
- npm publish of `asciichem` once trusted publishing is registered
  (maintainer); the site currently pins `github:asciichem/asciichem-ts`.
