# 57 — Ruby SMILES + molfile implementation

- **Priority:** P2
- **Status:** done — asciichem-ruby#55 (unreleased; 1755 examples green)
- **Repo:** asciichem-ruby
- **Depends on:** 55 (schemas), 56 (fixtures)

## What

- `Model::Atom` gains `aromatic`, `hydrogens`; `Bond::KINDS` gains
  `aromatic` (ascii `:`). No AsciiChem-syntax changes — these fields
  arrive via ingestion.
- `AsciiChem::Smiles` — parslet grammar + transform to `Model`
  (organic subset, bracket atoms with isotope/charge/H-count,
  branches, ring closures incl. `%nn`, dots, aromatic), plus a
  deterministic writer (`to_smiles`): DFS from the first atom reusing
  the Layout `MoleculeWalker`'s neutral atom+bond graph, ring digits
  assigned in encounter order. Not a canonical-rank algorithm —
  documented as *deterministic* SMILES; stability property
  `to_smiles(to_smiles(x)) == to_smiles(x)` spec'd.
- `AsciiChem::Molfile` — V2000 parser (counts, atom block with
  coords/charge via M CHG/isotope via M ISO, bond block with types
  and stereo codes) and writer (Layout coordinates when the model has
  none). Preserved coordinates feed StructuralSvg without relayout.
- APIs: `AsciiChem.parse_smiles(s)` → `Model::Formula` (one Molecule
  per dot-component), `AsciiChem.parse_molfile(text)`,
  `Model::{Molecule,Formula}#to_smiles`, `Molecule#to_molfile`.
- WireAdapter passes `aromatic`/`hydrogens`/aromatic bond kind
  through (emission + core ingestion).
- v1 deferrals, each with a rejecting spec and actionable message:
  `@`/`@@` chirality, `/` `\` bond directions, reaction maps.

## Acceptance

- Corpus `smiles`/`molfile` levels at 100%.
- Full suite green; no new runtime dependencies.
