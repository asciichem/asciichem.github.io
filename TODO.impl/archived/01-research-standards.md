# 01 — Research: IUPAC, mhchem, chemfig

- **Priority:** P1 (research, parallel with implementation)
- **Status:** pending
- **Depends on:** nothing
- **Blocks:** 03 (model), 13 (extended constructs), spec content

## Motivation

AsciiChem's syntax must be defensible against external authorities. Before
locking in syntax decisions, we need a written audit of:

- IUPAC Green Book (3rd ed., 2007) — quantities, units, symbols in physical
  chemistry.
- IUPAC Recommendation, *Pure Appl. Chem.* **90** (2018) 175–180.
- LaTeX `mhchem` (formula syntax) — https://ctan.org/pkg/mhchem.
- LaTeX `chemfig` (structural diagrams) — https://ctan.org/pkg/chemfig.
- Overleaf chemistry survey —
  https://www.overleaf.com/learn/latex/Chemistry_formulae.

The audit lives in `docs/research/`. The output is one markdown file per
source plus an index (`docs/research/README.md`) summarising what AsciiChem
borrows, what it diverges from, and why.

## Scope

1. Download/read each source (store originals under `docs/research/sources/`
   — never delete).
2. For each source, list every construct relevant to chemistry typography,
   its existing ASCII spelling (if any), and the semantic gap relative to
   AsciiMath.
3. Propose an AsciiChem spelling for each, with rationale.
4. Cross-reference with the model classes in TODO 03.

## Acceptance

- `docs/research/iupac-greenbook.md`, `mhchem.md`, `chemfig.md`,
  `overleaf-survey.md` written.
- `docs/research/README.md` index with decision table.
- Each proposal maps to either an implemented model class or a follow-up
  TODO.
