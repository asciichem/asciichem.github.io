# 43 — Molfile reader/writer

- **Priority:** P2
- **Status:** pending
- **Depends on:** 42 (shared interchange registry patterns)
- **Implements:** TODO.v2 09

## Motivation

Molfile (CTfile V2000) is the highest-fidelity structure interchange:
atom coordinates feed Layout/StructuralSvg directly (no relayout),
and molfile emission is the pipe into the InChI engine (TODO 48).

## Scope

- `Interchange[:molfile]` reader/writer: counts line, atom block
  (symbol, charge, isotope via mass difference, x/y/z → coordinate
  annotations), bond block (types 1/2/3, stereo wedges → wedge bonds).
- Emission uses Layout coordinates when present, computed positions
  otherwise.
- Corpus fixtures incl. the recorded Common Chemistry aspirin molfile.

## Acceptance

- Aspirin molfile ingests → model → StructuralSvg with coordinates
  preserved; round-trip model → molfile → model semantically equal for
  the convertible subset; offline fixtures only.
