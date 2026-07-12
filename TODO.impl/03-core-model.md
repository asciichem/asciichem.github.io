# 03 — Core model classes

- **Priority:** P1 (foundation)
- **Status:** pending
- **Depends on:** 02
- **Blocks:** 04, 05, 06

## Motivation

The model is the contract. Every parser, every formatter, every spec
hinges on these classes being right. The central semantic fix over
AsciiMath — prefix superscripts bind to the following atom, not to a
phantom `{}` — must be expressed structurally here.

## Scope

`lib/asciichem/model.rb` — `module Model` with autoloads for every class.

`lib/asciichem/model/`:

- `formula.rb` — `Formula` (container; ordered list of nodes; the parse
  root).
- `atom.rb` — `Atom` with `element` (String, e.g. `"C"`), `isotope`
  (String, optional — prefix superscript), `subscript` (String, optional),
  `superscript` (String, optional — covers charge and oxidation state).
- `molecule.rb` — `Molecule` (ordered list of `Atom` / `Group` nodes;
  multiplicity belongs on the inner nodes, not the molecule).
- `group.rb` — `Group` (parenthesised sub-formula; has `:nodes` and
  `:multiplicity` and `:bracket` — one of `:paren`, `:square`, `:brace`).
- `bond.rb` — `Bond` with `kind` enum: `:single`, `:double`, `:triple`,
  `:wedge`, `:hash`, `:dative`, `:wavy`. Endpoints are positional in the
  parent sequence.
- `reaction.rb` — `Reaction` with `reactants` (Array), `products` (Array),
  `arrow` (`:forward`, `:reverse`, `:equilibrium`, `:resonance`), and
  `conditions` (`{ above: ..., below: ... }`).
- `electron_configuration.rb` — `ElectronConfiguration` (list of
  orbital / occupancy pairs, e.g. `1s^2`); plus `TermSymbol` with
  multiplicity, letter, J.
- `embedded_math.rb` — `EmbeddedMath` wrapping a `Plurimath::Math::Formula`.
- `text.rb` — `Text` for unhandled runs (operators, whitespace).

All classes:

- `attr_accessor` for the documented fields.
- `initialize` sets defaults.
- `==` compares class + fields.
- `to_s` returns a debug representation — **not** round-trip text. Round
  trip is the formatter's job (TODO 05).
- Each is a `Struct`-like plain class. No hand-rolled `to_h`/`from_h`
  (global rule).

Visitor support (used by formatters): each class implements
`accept(formatter)` calling `formatter.visit_<class_name>(self)`. This is
double-dispatch — keeps formatters OCP (new format = new visitor, no model
edits).

## Acceptance

- Every model class instantiable with keyword args.
- Equality specs pass.
- `accept` dispatch verified by a stub formatter spec (real model
  instance, no doubles).
- `bundle exec rspec spec/asciichem/model` passes.
