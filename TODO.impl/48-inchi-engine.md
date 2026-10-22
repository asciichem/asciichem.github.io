# 48 — InChI identity engine + cross-check

- **Priority:** P3
- **Status:** done (2026-09-14) — binary adapter + linter + CLI; follow-ups noted below
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

## Shipped (2026-09-14)

- Ruby: `AsciiChem::Inchi` (Engine / BinaryEngine / Identity),
  `EngineMissingError`, `IdentityCrossCheck` linter (engine-scaled:
  no engine = one guidance warning on annotated molecules),
  `asciichem identity` CLI (`--from asciichem|smiles|molfile`,
  `--engine-bin`). Specs run offline against a deterministic stub
  binary that emulates the `inchi-1` `-STDIO -AuxNone -NoLabels
  -Key` contract (aspirin + ethanol shapes, recorded values).
- Python: `asciichem.inchi` seam with `RdkitEngine` behind the
  `asciichem[inchi]` extra (per TODO.v2 10).
- TypeScript: `src/inchi.ts` seam (`setInchiEngine`,
  `inchiIdentityFor`, `EngineMissingError`).

## Follow-ups (gated)

- Native engine program moved to [TODO 66](66-native-inchi.md): the
  maintainer directed a native implementation across runtimes
  (2026-10-21), so "never reimplement InChI" in the Motivation above is
  superseded. Vendoring the IUPAC libinchi remains closed — the IUPAC
  binary is a development-time oracle only.
- TS inchi-wasm adapter: blocked on a published WASM build pairing
  with TODO.v2 11/12; the native engine (TODO 66, M6) is the intended
  producer.
- Resolver Layer-2 structural comparison currently rides the
  linter's engine when configured; folding it into
  `Resolver.resolve!` directly is future polish, not contract.

