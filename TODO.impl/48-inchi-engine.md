# 48 — InChI identity engine + cross-check

- **Priority:** P3
- **Status:** pending
- **Depends on:** 43 (molfile emission is the pipe)
- **Implements:** TODO.v2 10

## Motivation

Compute identity locally: model → molfile → IUPAC InChI software →
InChI/InChIKey. Enables local identity for authored molecules,
structural cross-check of annotations, and InChIKey anchors for
never-resolved molecules. Never reimplement InChI.

## Scope

- Optional engine abstraction (core stays dependency-free):
  `to_inchi(molecule, standard: true)` / `to_inchikey`. Adapters:
  Ruby FFI/standalone-binary, PY RDKit extra, TS inchi-wasm. Absent
  engine → descriptive `EngineMissingError`.
- `IdentityCrossCheck` opt-in linter: computed key vs annotated/
  resolver-derived keys; mismatch = error with engine, guidance
  warning without.
- Licence review of InChI Trust terms recorded before any vendoring
  (maintainer decision).
- Canonical fixture: aspirin → `InChI=1S/C9H8O4/...` →
  `BSYNRYMUTXBXSQ-UHFFFAOYSA-N` (verified via PubChem CID 2244,
  2026-09-08; recorded, tests offline).

## Acceptance

- Derived key matches recorded aspirin fixture; wrong `@inchi`
  annotation caught by the linter; zero new hard core deps.
