# 56 — SMILES/molfile corpus fixtures (asciichem-tests)

- **Priority:** P2
- **Status:** done — asciichem-tests#4, v0.3.0 (tagged)
- **Repo:** asciichem-tests

## What

New fixture files under distinct keys so every implementation opts in
by level, exactly like `cmlRoundTrip` before:

- `smiles.json` — `{ id, smiles, parses, smilesRoundTrip?, tags,
  since }`. ~25 cases: organic subset, brackets (`[NH4+]`, `[13CH4]`,
  `[nH]`), branches, rings (`%10` two-digit closures included),
  aromatic rings, charges, dots (disconnected), aspirin canonical
  SMILES, plus rejects (unclosed ring, chirality `@` — v1 subset —
  `C--C`, stray brackets).
- `molfile.json` — `{ id, molfile, parses, molfileRoundTrip?, atoms,
  bonds, tags, since }`. Multiline V2000 strings: water, ethanol,
  benzene, cyclohexane, aspirin; reject cases (bad counts line,
  truncated atom block).

`smilesRoundTrip` asserts `to_smiles(parse_smiles(s)) == s` (fixtures
hold the canonical form). `molfileRoundTrip` asserts
`parse_molfile(to_molfile(m))` is semantically equal.

## Changes

- fixtures, `corpus/schemas/conformance.schema.json`,
  `scripts/validate.rb`, `docs/runner-contract.adoc`, version 0.3.0.

## Acceptance

- `scripts/validate.rb` passes on the new files.
- Gem/TS CI unaffected until they opt in (distinct keys prove it).
