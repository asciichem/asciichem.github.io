# 18 — 2D structural formulae via elk-rb

- **Priority:** P2 (next big feature after v0.1 ships)
- **Status:** pending
- **Depends on:** 03, 04, 13 (linear bonds)
- **Blocks:** 19 (stereo), 22 (Lewis)
- **Supersedes:** the "structural diagrams" deferral in TODO 13

## Motivation

v0.1 represents bonds linearly (`H-O-H`, `H_2C=CH_2`). Real chemistry
needs 2D layout: skeletal formulae, ring structures, stereochemistry.
chemfig handles this in LaTeX via TikZ; AsciiChem needs an equivalent
that fits the model-driven pipeline.

`mn/elk-rb` (https://github.com/mn/elk-rb, sibling project) wraps the
Eclipse Layout Kernel in Ruby. It lays out graphs; we have the graph
(molecule atoms + bonds). Plug them together.

## Scope

- `AsciiChem::Formatter::Svg::Structural` — a new formatter that
  delegates layout to elk-rb and renders to SVG.
- The formatter walks the molecule's nodes, extracts atoms (positions
  unknown) and bonds (typed relationships), hands the graph to
  elk-rb, and emits an SVG with atoms at laid-out positions and bonds
  as drawn edges.
- Bond drawing per kind: single = line, double = parallel pair,
  triple = triple parallel, wedge = filled triangle, hash = hashed
  line, dative = arrow.
- Ring detection (for benzene, cyclohexane, etc.) — out of scope for
  the first cut; elk-rb's force-directed layout handles it without
  explicit ring annotation.
- New grammar production for ring shorthand: `ring(6, -=-=-=)` or
  similar (design TBD via TODO 19).

## Acceptance

- `AsciiChem.parse("H_2C=CH_2").to_svg(structural: true)` produces an
  SVG with two carbons connected by a double-line bond, each with two
  hydrogens.
- Skeletal formula for cyclohexane renders as a hexagon.
- SVG is well-formed and viewable in browsers.
- Spec coverage for at least: single/double/triple bonds, branching,
  one ring.
