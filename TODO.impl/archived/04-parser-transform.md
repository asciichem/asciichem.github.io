# 04 — Parslet parser and transform

- **Priority:** P1 (foundation)
- **Status:** pending
- **Depends on:** 02, 03
- **Blocks:** 05, 06

## Motivation

The parser converts text into a parse tree; the transform converts the
parse tree into model instances. Splitting the two stages matches Plurimath
and keeps grammar concerns separate from model construction.

## Scope

`lib/asciichem/parser.rb` — `class Parser < Parslet::Parser`. Grammar for
v1:

- Formula = sequence of nodes.
- Node = reaction | structural_chain | moleecule | atom | electron_config
  | embedded_math | text.
- Prefix isotope: `^14` followed by an atom binds to that atom.
- Atom = `[prefix_isotope]? element [suffix]?`, where `element` is
  `[A-Z][a-z]?` and suffix is combination of `_<sub>` and `^<super>` (with
  charges like `2+`, `2-`, `+`, `-`).
- Group = `( nodes ) <multiplicity>?` with bracket variants `[]`, `{}`.
- Molecule = sequence of atoms/groups.
- Bond = `-` | `=` | `#` | `->` | `<-` between nodes.
- Reaction = `<lhs> arrow [<conditions>] <rhs>` where arrow is one of
  `->`, `<-`, `<=>`, `<->`, `|-` (resonance).
- Electron config = `(orbital)<super>` runs.
- Embedded math = backtick-delimited run, parsed by
  `Plurimath::Asciimath`.

Whitespace is generally insignificant except inside math escapes and
text runs.

`lib/asciichem/transform.rb` — `class Transform < Parslet::Transform`. Each
rule constructs a model instance. The prefix-isotope binding is enforced
here: a `prefix_isotope? simple_node` sequence becomes a single `Atom` with
`isotope:` set — never an empty carrier.

`lib/asciichem.rb` exposes `AsciiChem.parse(text) -> Model::Formula`.

## Acceptance

- `AsciiChem.parse("H_2O")` produces a `Formula` with one `Molecule`
  containing `Atom("H", sub: "2")` and `Atom("O")`.
- `AsciiChem.parse("^14C")` produces `Formula[Atom("C", iso: "14")]` —
  no phantom element.
- `AsciiChem.parse("2H_2 + O_2 -> 2H_2O")` produces a `Reaction`.
- `AsciiChem.parse("1s^2 2s^2")` produces an `ElectronConfiguration`.
- All parser specs in `spec/parser_spec.rb` pass.
