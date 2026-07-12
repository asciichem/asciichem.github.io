# 12 — Examples and worked walkthroughs

- **Priority:** P2
- **Status:** pending
- **Depends on:** 09, 10, 11

## Motivation

Chemists learn syntax from real-world examples, not abstract grammars.
Each example page walks through a published formula or reaction, line by
line, showing the AsciiChem spelling and the rendered output.

## Scope

`src/content/docs/examples/`:

- `water-and-hydration.mdx` — `H_2O`, hydration shells, water of
  crystallisation (`CuSO_4 · 5H_2O`).
- `isotopes.mdx` — `^14C` dating, `^131I`, `^238U` decay series.
- `coordination-complexes.mdx` — `[Fe(CN)_6]^4-`, brackets, charge
  placement.
- `acid-base-equilibria.mdx` — `HAc <=> Ac^- + H^+`, `K_a` math
  embedding.
- `redox-reactions.mdx` — half-reactions with oxidation states.
- `organic-skeletal.mdx` — pointing forward to SVG rendering for
  skeletal formulae (TODO 07).
- `electron-configurations.mdx` — ground-state configs across the
  periodic table, Hund's rule illustrations.

## Acceptance

- Every example page has 3+ rendered AsciiChem blocks.
- Every block round-trips through the gem.
- Cross-links to syntax pages for the constructs used.
