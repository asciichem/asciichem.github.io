# 07 — Other formatters (HTML, LaTeX/mhchem, SVG)

- **Priority:** P2
- **Status:** pending
- **Depends on:** 03, 05
- **Blocks:** site rendering richness

## Motivation

MathML is not the only useful output. HTML (for inline display without
MathJax), LaTeX/mhchem (for chemistry-aware LaTeX authors), and SVG (for
structural diagrams that MathML cannot express) all belong behind the
same OCP formatter interface.

## Scope

Each formatter subclasses `AsciiChem::Formatter::Base` and registers
itself with `AsciiChem::Formatter.register(:name, Klass)`. The model's
`to_<name>` method looks up the registry — adding a new output is a new
file, not edits to existing code.

- `lib/asciichem/formatter/html.rb` — HTML output using `<sub>`/`<sup>`
  tags, suitable for inline text. Example: `H<sub>2</sub>O`.
- `lib/asciichem/formatter/latex.rb` — LaTeX mhchem-style output. Wraps
  formulae in `\ce{...}` when mhchem-compatible output is requested.
  Example: `H_2O` → `\ce{H2O}`.
- `lib/asciichem/formatter/svg.rb` — SVG for structural formulae (bonds,
  rings, stereo). Delegates layout to `mn/elk-rb` when the structure has
  bonds; falls back to linear text rendering otherwise.

## Acceptance

- Each formatter registers itself and is reachable via
  `AsciiChem::Formatter.for(:html)` etc.
- One spec per formatter, mirroring the MathML spec structure.
- New formatter can be added in a single new file with no edits to
  existing formatters (OCP test).
