# 30 — Model node schemas + canonical wire form

- **Priority:** P1
- **Status:** in-progress (2026-09-09 — core chemistry nodes shipped in asciichem-model#1: formula, group, bond, reaction, reaction-cascade + seed atom/molecule/identifier; remaining: electron-configuration, embedded-math, text, name, mechanism, spectrum, crystal, zmatrix, calculation + negative examples)
- **Depends on:** 29
- **Implements:** TODO.v2 01

## Motivation

One canonical JSON serialisation of the model tree — node `type`
discriminator + typed fields — is the interchange format every
implementation must parse and emit, and the fixture format for the
corpus.

## Scope

- `schemas/v1/` one YAML schema per node type, mirroring the Ruby
  model inventory: `formula`, `atom`, `molecule`, `group`, `bond`,
  `reaction`, `reaction-cascade`, `electron-configuration`,
  `embedded-math`, `text`, `identifier`, `name`, `mechanism`,
  `spectrum`, `crystal`, `zmatrix`, `calculation`.
- Corresponding `models/asciichem/*.lutaml` definitions.
- Canonical envelope: root `{ "modelVersion": "1.x", "root": <node> }`.
- Numbered examples (positive + negative) per node type; a
  negative-examples validator proves the bad ones fail.
- Semantics written from the Ruby classes (reference) + spec-site
  `docs/model/` pages.

## Acceptance

- Every construct in the gem's `spec/integration/edge_cases_spec.rb`
  (round-trippable cases) has a schema + example.
- Positive examples validate; negative examples reject, in CI.
- `AsciiChem.parse(s) → canonical JSON → schema-validate` CI job green
  (temporary vendored corpus until 33/34).
