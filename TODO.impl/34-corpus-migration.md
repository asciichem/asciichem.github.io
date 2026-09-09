# 34 — Corpus migration + identifier fixtures

- **Priority:** P1
- **Status:** pending
- **Depends on:** 33
- **Implements:** TODO.v2 02

## Motivation

Conformance is only real if the corpus carries the gem's accumulated
edge-case knowledge, plus the new v2 identifier cases.

## Scope

- Migrate from the gem: `spec/integration/edge_cases_spec.rb` (60+),
  `spec/fuzz/corpus/` (15 files — the error contract becomes a fixture
  field), CML three-way round-trips from `spec/asciichem/cml/`, linter
  expectations as `lint` fixtures.
- Identifier fixture set (≥ 30 cases): valid/invalid CAS RNs (check
  digit — `7732-18-5`, `50-78-2`, `74-82-8` good; corrupted variants
  bad), valid/invalid InChI (prefix, formula layer) and InChIKey
  (14-10-1 format), SMILES formula-consistency pairs.
- Rules: fixtures are data not code; never edit a fixture to make a
  new implementation pass.

## Acceptance

- Coverage count ≥ current gem corpus; every spec-site construct and
  every grammar production has ≥ 3 cases (positive/negative/boundary).
- Ruby reference runner passes 100% of L0–L4 (via 37).
