# 47 — Python API (`asciichem-py`)

- **Priority:** P2
- **Status:** pending (blocked on 36 ADR)
- **Implements:** TODO.v2 06

## Motivation

The cheminformatics world (RDKit, OPSIN, molecule-resolver,
PubChemPy) is Python-shaped; `asciichem` on PyPI makes AsciiChem the
authoring syntax of that ecosystem — the ascii ⇒ chem ⇒ identity ⇒
citation pipeline end-to-end in notebooks.

## Scope

- New repo `asciichem-py` (PyPI `asciichem`): dataclass model
  generated from / validated against `asciichem-model` schemas;
  parser conforming to the corpus; canonical JSON in/out.
- Formatters phased as 46; pytest conformance runner emitting
  `conformance.json`.
- Ecosystem bridges as optional extras: `asciichem[rdkit]`
  (`to_rdkit()` via SMILES/molfile from 42/43), resolver helpers
  (38), `asciichem[inchi]` (48). Bridges degrade gracefully when
  extras are missing; never part of the conformance surface.
- No packaging side effects (global rule): caches to user cache dir
  only.

## Acceptance

- L0–L2 at 100% of corpus; `to_rdkit()` round-trips corpus molecules
  with SMILES annotations; conformance.json in CI.
