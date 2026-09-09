# 49 — `metanorma-asciichem` integration

- **Priority:** P3
- **Status:** pending
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
