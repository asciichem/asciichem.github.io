# 58 — TypeScript SMILES + molfile implementation

- **Priority:** P2
- **Status:** done — asciichem-ts#2 (503 tests green, git dep until npm publish)
- **Repo:** asciichem-ts
- **Depends on:** 55 (types), 56 (fixtures)

## What

Mirror of TODO 57 in TypeScript:

- model fields (`aromatic`, `hydrogens`, aromatic bond kind) and
  re-vendored wire types from the model 0.3.5 tag.
- `grammar/smiles.pegjs` (same subset and deferrals as the Ruby
  grammar) + transform + deterministic writer reusing
  `walkMolecule`.
- `src/molfile/` V2000 parser + writer (layout.ts coordinates).
- Public API: `parseSmiles`, `parseMolfile`, `toSmiles`,
  `toMolfile`; SVG renderers draw aromatic bonds dashed.
- Conformance runner handles the `smiles`/`molfile` fixture kinds.

## Acceptance

- Corpus `smiles`/`molfile` levels at 100%; existing L0/L1/parse
  levels unchanged; full Vitest suite green.
