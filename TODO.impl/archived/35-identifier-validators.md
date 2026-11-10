# 35 — Identifier validators + linter checks (gem Layer 1)

- **Priority:** P1
- **Status:** **done** (2026-09-09; PR pending — working tree only)
- **Depends on:** nothing
- **Implements:** TODO.v2 07 Layer 1

## Motivation

Identifier annotations (`@cas`, `@inchi`, `@smiles`, …) are accepted
but never validated. Format validation is offline, license-free, and
immediately useful — it catches typos (`@cas("50782")`) at lint time.

## Scope

- `AsciiChem::Identifiers` module with one validator per convention,
  registered in a registry (OCP — new convention = one class + one
  registration): `Cas` (check-digit algorithm; reference:
  CAS_Validation, MIT — reimplemented, not copied), `Inchi` (versioned
  prefix, formula layer validated against `PeriodicTable`), `Inchikey`
  (14-10-1 uppercase blocks), `Smiles` (structural sanity: balanced
  brackets/parens, paired ring digits, known element tokens).
- Linter checks, self-registering per Linter OCP:
  `IdentifierFormatCheck` (known convention + invalid format →
  diagnostic with the validator's message), `IdentifierConsistencyCheck`
  (InChI formula layer element counts vs molecule composition; SMILES
  element set vs molecule elements).
- Full specs: validators with known-good/known-bad values; linter
  checks with real model instances (no doubles).

## Acceptance

- `bundle exec rspec` green; `bundle exec rubocop` clean.
- No network code in the default load path; validators pure.
- Diagnostic messages actionable (name the convention and the reason).
