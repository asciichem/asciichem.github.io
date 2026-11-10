# 39 — PubChem resolver adapter

- **Priority:** P2
- **Status:** done — gem#59 (synonyms/citation-profile follow-ups noted)
- **Depends on:** 38
- **Implements:** TODO.v2 07 Layer 2

## Motivation

PubChem is the default source: keyless PUG-REST, permissive terms,
and the bulk mirror of Common Chemistry's validated CAS RNs (source
24603). It is also the cache-seeding path given Common Chemistry has
no official bulk download.

## Scope

- `Resolver::PubChem`: query by CAS RN / name / InChI / InChIKey /
  SMILES / CID → `SubstanceRecord` (names, synonyms, formula, MW,
  identifiers with per-field source attribution).
- Citation profile for 08: NCBI publisher, release-or-accessed
  versioning, `pubchem.ncbi.nlm.nih.gov/compound/{cid}` links.
- Recorded fixture responses for specs (offline).

## Acceptance

- Aspirin fixture resolves fully offline; profile emits correct
  bibitem fields; rate-limit politeness documented.
