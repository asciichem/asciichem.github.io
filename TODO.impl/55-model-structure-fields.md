# 55 — Model fields for external structures (aromatic, hydrogens)

- **Priority:** P2
- **Status:** done — asciichem-model#11, v0.4.0 (tagged; rubygems push pending trusted-publisher registration)
- **Repo:** asciichem-model
- **Depends on:** TODO.v2 09 decision (2026-09-12)

## What

Additive v1 fields so SMILES/molfile molecules carry their full
meaning through the model and wire form:

- `atom.aromatic` (boolean) — SMILES lowercase atoms (`c1ccccc1`),
  molfile aromatic bond contexts.
- `atom.hydrogens` (integer ≥ 0) — implicit-H count from SMILES
  bracket atoms (`[CH4]`, `[nH]`) and molfile atom-block H counts.
  Absent means "per valence rules" (exactly what a bare SMILES symbol
  says); it is never invented.
- `bond.kind` gains `aromatic` — SMILES adjacency between aromatic
  atoms, molfile bond type 4.

Schema files stay closed (`additionalProperties: false`), so this
must merge before any implementation emits the fields.

## Changes

- `models/asciichem/{atom,bond}.lutaml`, `schemas/v1/{atom,bond}.yaml`
- regenerate `schemas/v1/types/*.ts`
- validator specs + a positive example carrying the new fields
- version 0.3.5 (additive = patch per the repo's SemVer table),
  Gemfile.lock regenerated

## Acceptance

- Validators accept and reject the new fields correctly.
- Generated TS types carry them.
- No existing schema changed in a breaking way.
