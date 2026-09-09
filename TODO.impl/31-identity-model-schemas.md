# 31 — Identity model schemas

- **Priority:** P1
- **Status:** **done** (2026-09-09 — asciichem-model#1:
  `provenance` + `substance-record` schemas, lutaml definitions,
  aspirin worked example; identifiers each carry provenance,
  attribution line required for NC-licensed sources)
- **Depends on:** 29
- **Implements:** TODO.v2 01 (identity part)

## Motivation

Substance identity (chem ⇒ identity ⇒ citation) needs its own schema
surface: identifier conventions, provenance, and the resolved
`SubstanceRecord` that resolver output (TODO.v2 07) maps onto 1:1.

## Scope

- `schemas/v1/identifier.yaml` — `value` + `convention` +
  `dict_ref`; conventions enum: `cas`, `inchi`, `inchikey`, `smiles`,
  `canonical-smiles`, `iupac-name`, `pubchem-cid`, `chebi`; format
  constraint annotations (CAS check digit, InChIKey 14-10-1 blocks).
- `schemas/v1/provenance.yaml` — source, retrieved-at, source
  version, attribution string.
- `schemas/v1/substance-record.yaml` — preferred name, synonyms,
  formula, molecular weight, identifiers (each with provenance),
  properties (each with provenance). Shaped after the CAS Common
  Chemistry detail payload.
- Lutaml definitions + positive/negative examples for each.

## Acceptance

- Schemas + examples validate/reject correctly in CI.
- Aspirin record (CAS 50-78-2, InChI/InChIKey/formula/MW) encodes as
  a valid example.
