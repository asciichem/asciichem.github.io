# 42 — SMILES reader/writer

- **Priority:** P2
- **Status:** pending
- **Depends on:** nothing hard (pairs with 07 workflow)
- **Implements:** TODO.v2 09

## Motivation

The flagship v2 workflow — resolve a substance and render its
structure — needs SMILES ingestion; emission lets AsciiChem-authored
molecules flow into RDKit tooling.

## Scope

- `Interchange[:smiles]` reader/writer pair (registry mirrors
  Formatter OCP). Subset: atoms incl. bracket atoms, bonds `- = #`,
  stereo `@/@@` and `/\` mapped to existing parity/E-Z annotations,
  branches, ring digits (AsciiChem's ring closures are already
  SMILES-style), charges, isotopes.
- Kekulé-only: lowercase aromatic atoms rejected with actionable
  ParseError (aromatic perception is a TODO.v2 01 model extension).
- Every mapping loss documented and spec'd; no silent mangling.
- Corpus interchange fixtures (Ascichem ↔ SMILES pairs, convertible
  subset) incl. the recorded Common Chemistry aspirin canonical SMILES.

## Acceptance

- Aspirin SMILES fixture ingests → model → StructuralSvg renders
  (visual spec).
- model → SMILES → model semantically equal for the convertible
  subset; ≥ 40 corpus cases; pure-Ruby, no new hard deps.
