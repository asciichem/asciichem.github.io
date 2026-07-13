# 26 — CML (Chemical Markup Language) round-trip

- **Priority:** P2
- **Status:** pending
- **Depends on:** 03 (core model), 04 (parser), 05 (formatters)
- **Blocks:** nothing
- **Standards reference:** https://www.xml-cml.org/, CML v2.4 + v3 spec
  (Murray-Rust, Rzepa, Wright et al.)
- **Implementation framework:** [lutaml-model](https://github.com/lutaml/lutaml-model)
  — **no hand-rolled serialization.** All CML wire-format (de)serialization
  goes through lutaml-model with declared `attribute` + `mapping` blocks.

## Motivation

CML is the established XML standard for chemistry. Tools like
Avogadro, JChempaint, JUMBO, and countless institutional archives
read/write CML natively. AsciiChem can already round-trip to
MathML/HTML/LaTeX/SVG — adding CML means:

1. **Interoperability.** AsciiChem content feeds into CML-native
   tools without manual conversion.
2. **Lossless XML persistence.** CML is the natural interchange
   format for AsciiChem's model — every model field maps to a CML
   attribute or element.
3. **Round-trip proof.** CML → Model → CML should be byte-equal
   modulo whitespace, providing a strong correctness check on the
   model itself.
4. **Publication workflows.** Chemistry publishers increasingly
   require CML submissions alongside PDF.

Unlike our other formatters (MathML, HTML, LaTeX, SVG), CML is a
**semantic** format — it captures chemistry meaning, not just
presentation. This makes CML round-trip the strongest available test
of model completeness.

## Architecture

The CML implementation is **not** just another formatter — CML has
its own model layer, parallel to AsciiChem's. The architecture is:

```
   AsciiChem::Model          Cml::Model
   (chemistry semantics)     (CML XML wire format)
        ▲                          ▲
        │                          │
   AsciiChem::Parser          lutaml-model
   (text -> AsciiChem::Model) (CML XML <-> Cml::Model)
        │                          │
        ▼                          │
   AsciiChem text input             │
                                   │
        ┌──────────────────────────┘
        │
        ▼
   Cml::Translator (adapter)
   AsciiChem::Model <-> Cml::Model
```

Three concerns, MECE:

1. **`AsciiChem::Model`** — chemistry semantics. Unchanged.
2. **`Cml::Model`** — CML wire-format classes, declared via
   lutaml-model. Each CML element (`<molecule>`, `<atom>`, `<bond>`,
   `<reaction>`, ...) is its own class with `attribute` declarations
   and a `mapping` block for the XML wire names. Serialization /
   deserialization is lutaml-model's responsibility — we never write
   `to_xml` / `from_xml` by hand.
3. **`Cml::Translator`** — the adapter between the two models. Pure
   transformation logic, no I/O. Adding a new model field means
   updating the translator's mapping rules; the Cml::Model and
   AsciiChem::Model classes stay independent.

This is the same architecture Plurimath uses for its format adapters,
and it matches the global rule: serialization goes through a
framework (lutaml-model), never hand-rolled.

## Scope

### CML model layer (lutaml-model)

`lib/asciichem/cml.rb` — `module Cml` namespace.

`lib/asciichem/cml/` — one file per CML element class:

| File                  | Class               | CML element                                           |
| --------------------- | ------------------- | ---------------------------------------------------- |
| `molecule.rb`         | `Cml::Molecule`     | `<molecule id="...">`                                |
| `atom.rb`             | `Cml::Atom`         | `<atom id elementType formalCharge isotopicMass spinMultiplicity ...>` |
| `atom_array.rb`       | `Cml::AtomArray`    | `<atomArray>` containing atoms                       |
| `bond.rb`             | `Cml::Bond`         | `<bond atomRefs2 order>`                             |
| `bond_array.rb`       | `Cml::BondArray`    | `<bondArray>` containing bonds                       |
| `reaction.rb`         | `Cml::Reaction`     | `<reaction>` with `<reactantList>` / `<productList>` |
| `reactant.rb`         | `Cml::Reactant`     | `<reactant>` referencing a `<molecule>`              |
| `product.rb`          | `Cml::Product`      | `<product>` referencing a `<molecule>`               |
| `reactant_list.rb`    | `Cml::ReactantList` | `<reactantList>` wrapper                             |
| `product_list.rb`     | `Cml::ProductList`  | `<productList>` wrapper                              |
| `reaction_list.rb`    | `Cml::ReactionList` | `<reactionList>` for cascades                        |
| `name.rb`             | `Cml::Name`         | `<name>` for molecule names                          |
| `identifier.rb`       | `Cml::Identifier`   | `<identifier>` for InChI/SMILES pointers             |
| `document.rb`         | `Cml::Document`     | `<cml>` root                                         |

Each class declares its attributes and mapping. Example for
`Cml::Atom`:

```ruby
module AsciiChem
  module Cml
    class Atom < Lutaml::Model::Serializable
      attribute :id, :string
      attribute :element_type, :string
      attribute :formal_charge, :string
      attribute :isotope, :string
      attribute :hydrogen_count, :string
      attribute :lone_pairs, :integer
      attribute :radical_electrons, :integer

      xml do
        root "atom"
        map_attribute "id", to: :id
        map_attribute "elementType", to: :element_type
        map_attribute "formalCharge", to: :formal_charge
        map_attribute "isotope", to: :isotope
        map_attribute "hydrogenCount", to: :hydrogen_count
        # Custom AsciiChem extensions for fields CML doesn't natively
        # cover go in a namespaced attribute to keep the CML output
        # valid against the standard.
        map_attribute "aci:lonePairs", to: :lone_pairs,
                       namespace: "https://asciichem.org/cml-ext",
                       prefix: "aci"
        map_attribute "aci:radicalElectrons", to: :radical_electrons,
                       namespace: "https://asciichem.org/cml-ext",
                       prefix: "aci"
      end
    end
  end
end
```

### Translator (adapter pattern)

`lib/asciichem/cml/translator.rb` — `class Translator` with two
methods:

- `Translator.from_asciichem(formula)` — walks the AsciiChem::Model
  tree and constructs the equivalent `Cml::Document`.
- `Translator.to_asciichem(cml_document)` — walks the Cml::Model
  tree and constructs the equivalent `AsciiChem::Model::Formula`.

Adding a new model field means updating two places:
1. The lutaml-model class declaration (Cml::Atom or similar).
2. The translator's mapping rules.

That's it. No edits to the existing AsciiChem text parser, no edits
to the existing formatters (MathML/HTML/LaTeX/SVG).

### Public API

- `formula.to_cml` — convenience method on `Model::Formula` that
  calls `Cml::Translator.from_asciichem(self)` then
  `Lutaml::Model::Serializable#to_xml`.
- `AsciiChem::Cml.parse(xml_string)` — parses CML XML via
  `Cml::Document.from_xml(xml_string)` then
  `Translator.to_asciichem(document)`.

### CLI

- `asciichem convert -i "H_2O" -t cml` — emits CML XML.
- `asciichem parse-cml -i "<cml>...</cml>"` — emits AsciiChem text
  (or any other supported format).

### Spec page

`src/content/docs/reference/cml.mdx` — explains:

- What CML is and why AsciiChem supports it.
- The architecture diagram above (three concerns, MECE).
- The model → CML element mapping table, with worked examples.
- How custom AsciiChem extensions (Lewis markers, etc.) are encoded
  via the `aci:` namespace.
- Limitations (features CML has that we don't yet model; vice versa).
- Verifying round-trip with the CLI.

### Round-trip conformance

`spec/conformance/cml_round_trip_spec.rb` — for every AsciiChem
snippet in the existing round-trip suite:

1. Parse AsciiChem → AsciiChem::Model.
2. AsciiChem::Model → Cml::Model (translator) → CML XML.
3. CML XML → Cml::Model (lutaml-model) → AsciiChem::Model (translator).
4. AsciiChem::Model from step 1 must equal step 4.
5. Optionally: re-render step 4 to CML and compare byte-for-byte
   with step 2's output modulo insignificant whitespace.

This is the strictest correctness check we have.

## What this enables

- **Round-trip proof** of model completeness (stronger than the
  current text-only round-trip).
- **CML-tool ecosystem access** — AsciiChem content becomes a
  first-class citizen in chemistry toolchains.
- **Publication submission** to venues that require CML.
- **Future SMILES/InChI conversion** — many converters accept CML
  as input.
- **Reusable CML model layer** — the `Cml::*` classes are useful
  independent of AsciiChem; they could be extracted to a separate
  gem if demand warrants.

## What's out of scope

- **3D coordinates.** CML carries them; AsciiChem's model doesn't
  (yet). TODO 18 (2D structural via elk-rb) might add a `geometry`
  field that the translator could populate.
- **Spectroscopy / crystallography blocks.** CML has extensive
  support; AsciiChem's model doesn't cover these.
- **Polymer notation**. Green Book §2.10 mentions; CML has it; we
  don't model it.
- **Reaction kinetics.** CML supports `<reactionrate>` etc.; out of
  scope for v0.2.
- **CML schema validation.** The output will be well-formed but may
  not validate against the full CML schema until the geometry and
  metadata fields are populated. A follow-up TODO could add schema
  validation.

## Acceptance criteria

- [ ] `AsciiChem.parse("H_2O").to_cml` produces well-formed CML XML
      with `<molecule>`, `<atomArray>`, three `<atom>` elements.
- [ ] The CML output is produced via lutaml-model — no manual
      Nokogiri string building in the formatter path.
- [ ] `AsciiChem::Cml.parse(cml)` produces a `Model::Formula`
      equivalent to the AsciiChem-parsed form of the same content.
- [ ] CML → Model → CML is byte-equal (modulo whitespace) for every
      canonical input.
- [ ] The `Cml::*` class set is reusable — every class is exported
      in the `AsciiChem::Cml` namespace and instantiable on its own.
- [ ] Custom AsciiChem fields (Lewis markers, stereochemistry) ride
      in the `aci:` namespace so the CML stays schema-valid.
- [ ] CLI `convert -i "..." -t cml` and `parse-cml -i "<xml>..."`.
- [ ] Spec page `reference/cml.mdx` documents the mapping with
      worked examples.
- [ ] CI runs CML round-trip on every PR.

## Dependencies

Add `lutaml-model` to the gemspec runtime dependencies:

```ruby
spec.add_dependency "lutaml-model", "~> 0.8"
```

(lutaml-model already depends on Nokogiri for XML handling — we get
the parser/serializer for free.)
