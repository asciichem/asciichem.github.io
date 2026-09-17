# 49 — `metanorma-asciichem` integration

- **Priority:** P3
- **Status:** done (2026-09-16; renamed 2026-09-17 to [metanorma-plugin-asciichem](https://github.com/metanorma/metanorma-plugin-asciichem), PR 1)
- **Depends on:** 44, 45
- **Implements:** TODO.v2 08 §3

## Motivation

Metanorma documents need the full loop: chemistry blocks that render
AND generate dataset-type bibliographic entries automatically.

## Scope

- Metanorma-side gem (`metanorma-asciichem` or extension in an
  existing flavour gem — maintainer decision): AsciiChem
  `[chem]`/inline blocks render via the gem; pipeline collects
  resolved substances + sources, emits one bibitem per
  (source, substance), cross-references by InChIKey anchor.
- Relaton-flavour exploration (optional, separate decision): relaton
  fetch by CAS RN/InChIKey per source returning dataset bibitems.
- Worked example document shipped in docs.

## Acceptance

- Example Adoc renders formulas and produces a correct References
  section citing CAS Common Chemistry / PubChem.
- Same substance twice → one entry per source; two sources → two
  entries; InChIKey anchoring links across sections.

## Done (2026-09-16)

Shipped as the [`metanorma-asciichem`](https://github.com/asciichem/metanorma-asciichem)
gem (0.1.0, PR 1):

- `[chem]` blocks → `<formula><stem type="MathML">` through standoc's
  MathML detection. Validated against metanorma-standoc 3.5 in a
  separate bundle; the gem's README "Compatibility" records the
  relaton-bib pin conflict (asciichem `relaton-bib < 2` vs current
  metanorma-standoc requiring 2) that keeps the end-to-end XML spec
  out of the gem's own suite until asciichem relaxes the pin —
  surfaced as a maintainer decision.
- `chem:[]` inline macro (render-only; inline substitution runs after
  the citation-collecting treeprocessor).
- `@cite` molecules → dataset bibitems, one per (source, substance),
  deduped, InChIKey-anchored, appended as `[bibliography]`; resolution
  goes through `AsciiChem::Citation` — the same path as
  `asciichem cite`.
- `:asciichem-cache-dir:` document attribute for offline reproducible
  builds; 15 network-free specs (real PubChem / CAS Common Chemistry
  fixtures); worked example in `docs/example.adoc`.
- Release workflow ships OIDC-ready; RubyGems trusted-publisher
  registration and tagging remain maintainer actions.
- Relaton-flavour exploration: not pursued (separate decision, per plan).
