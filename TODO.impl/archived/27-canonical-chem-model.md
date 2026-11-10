# 27 — Canonical chemistry representation model

- **Priority:** P2 (architectural)
- **Status:** pending
- **Depends on:** 03 (AsciiChem::Model), 26 (CML round-trip)
- **Blocks:** every future format adapter (SMILES, InChI, MOL, etc.)

## Motivation

AsciiChem currently has **two** model layers:

- `AsciiChem::Model::*` — the chemistry model the parser produces and
  every formatter consumes.
- `Chemml::Cml::*` — the CML XML wire-format classes (lutaml-model).

The translator `AsciiChem::Cml::Translator` adapts between them. This
works, but it couples the canonical representation to the AsciiChem
syntax. As we add more formats (SMILES, InChI, MOL, PDB, ...), each
adapter would carry its own mapping to `AsciiChem::Model`, which
makes `AsciiChem::Model` the de-facto canonical hub — but its name
implies it's specific to AsciiChem.

The right architecture: define a **canonical chemistry representation
model** that is format-agnostic. AsciiChem text and CML XML (and
every future format) become **syntax layers** — parsers and
serialisers over the canonical model. No syntax layer owns the
canonical model; all of them speak it.

CML's element set is the natural inspiration for the canonical
classes: CML was designed by chemists for chemistry interchange, so
its primitives (`<atom>`, `<bond>`, `<molecule>`, `<reaction>`) are
already close to canonical. We strip the XML-specific parts (mapping
blocks, ID strings for cross-references, ordered lists) and keep
the chemistry semantics.

## Architecture

```
                              ┌─────────────────────────┐
                              │   Chemml::Model         │
                              │   (canonical,           │
                              │    format-agnostic)     │
                              └────────────┬────────────┘
                                           │
              ┌────────────────────────────┼────────────────────────────┐
              │                            │                            │
              ▼                            ▼                            ▼
   ┌─────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
   │  AsciiChem adapter  │    │  CML adapter            │    │  (future) SMILES adapter│
   │  - text parser      │    │  - XML parser           │    │  - SMILES parser        │
   │  - text formatter   │    │  - XML serialiser       │    │  - SMILES serialiser    │
   │  (AsciiChem::Model  │    │  (Chemml::Cml::*        │    │                         │
   │   stays as an       │    │   lutaml-model classes) │    │                         │
   │   intermediate form │    │                         │    │                         │
   │   for now)          │    │                         │    │                         │
   └─────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

Each adapter has:

- A **parser** that converts external input → `Chemml::Model`.
- A **serialiser** that converts `Chemml::Model` → external output.

Adapters never talk to each other directly — only through the
canonical model. This is OCP-clean: adding a new format is a new
adapter; existing adapters stay untouched.

## Scope

### Canonical classes (Chemml::Model)

`lib/chemml/model.rb` — namespace + autoloads.

`lib/chemml/model/`:

- `document.rb` — `Model::Document` (top-level container).
- `molecule.rb` — `Model::Molecule` (atoms + bonds + optional name).
- `atom.rb` — `Model::Atom` (element, isotope, charge, count, lone
  pairs, radical electrons, spin multiplicity, optional 2D/3D
  coordinates).
- `bond.rb` — `Model::Bond` (kind enum, endpoint atom references).
- `reaction.rb` — `Model::Reaction` (reactants, products, arrow,
  conditions).
- `reaction_list.rb` — `Model::ReactionList` (cascade).
- `substance.rb` — `Model::Substance` (reaction participant wrapper
  with role).
- `name.rb` — `Model::Name` (molecule name + convention).
- `identifier.rb` — `Model::Identifier` (external identifier like
  InChI / SMILES / CAS-RN).
- `node.rb` — `Model::Node` (base class with `children`, `accept`,
  equality via `value_attributes`).

Each class is a plain Ruby class (no lutaml-model). Fields are
`attr_accessor`. Equality is class + declared attributes. The
visitor pattern (`accept(visitor)` dispatching to
`visitor.visit_<class>`) lets future formatters (a `Chemml::Model`
MathML formatter, for example) walk the tree without switching on
type.

### Translators

Two adapters ship in this TODO:

1. **`Chemml::Cml::Translator`** — `Chemml::Model` ↔ `Chemml::Cml`
   (the CML wire-format layer). Lives in the chemml gem.
2. **`AsciiChem::ModelAdapter`** — `AsciiChem::Model` ↔
   `Chemml::Model`. Lives in the asciichem gem.

The existing `AsciiChem::Cml::Translator` becomes a thin composition
of these two adapters:

```ruby
def from_asciichem(formula)
  canonical = AsciiChem::ModelAdapter.to_canonical(formula)
  Chemml::Cml::Translator.from_canonical(canonical)
end

def to_asciichem(document)
  canonical = Chemml::Cml::Translator.to_canonical(document)
  AsciiChem::ModelAdapter.from_canonical(canonical)
end
```

### Round-trip conformance

`spec/conformance/canonical_round_trip_spec.rb` — every AsciiChem
canonical input must satisfy:

1. `AsciiChem.parse(s)` → `AsciiChem::Model::Formula` →
   `Chemml::Model::Document` → `Chemml::Model::Document` (identity).
2. `Chemml::Model::Document` → CML XML → parse back →
   `Chemml::Model::Document` (lossless).
3. `Chemml::Model::Document` → `AsciiChem::Model::Formula` → text
   equals the original input (round-trip exact).

This three-way round-trip is the strongest correctness check we
have: it proves the canonical model captures every feature that
AsciiChem syntax can express, and that the CML wire format captures
every feature the canonical model carries.

## Why not just rename AsciiChem::Model?

Two reasons:

1. **Backwards compatibility.** Every existing spec and downstream
   consumer references `AsciiChem::Model::*`. Renaming would be a
   breaking change. Introducing `Chemml::Model` as the canonical and
   bridging via `AsciiChem::ModelAdapter` lets us migrate gradually.
2. **Ownership.** The canonical model belongs in the chemml gem
   (format-neutral). `AsciiChem::Model` carries some
   AsciiChem-specific conveniences (e.g. the `Text` catch-all node
   for unhandled grammar fragments) that don't belong in a canonical
   model. Keeping them separate is MECE.

## What this enables

- **Future format adapters** (SMILES, InChI, MOL, PDB) plug into the
  canonical model — no edits to AsciiChem.
- **CML round-trip proof** at the canonical level (not just XML
  byte-equality).
- **Programmatic chemistry** — third-party tools can use
  `Chemml::Model` directly without going through any text format.
- **Schema generation** — once the canonical model is the source of
  truth, generating XSD / JSON Schema for the CML wire format
  becomes a one-liner via lutaml-model's schema features.

## Acceptance criteria

- [ ] `Chemml::Model::*` covers every construct that
      `AsciiChem::Model::*` and `Chemml::Cml::*` cover.
- [ ] `Chemml::Cml::Translator` round-trips CML XML via the
      canonical model.
- [ ] `AsciiChem::ModelAdapter` round-trips AsciiChem::Model via the
      canonical model.
- [ ] `AsciiChem::Cml::Translator` is reduced to a composition of
      the two new adapters.
- [ ] Every existing spec still passes.
- [ ] New specs cover the canonical model and both translators.
- [ ] The three-way round-trip conformance suite passes for every
      canonical AsciiChem input.
