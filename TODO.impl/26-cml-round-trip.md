# 26 — CML (Chemical Markup Language) round-trip

- **Priority:** P2
- **Status:** pending
- **Depends on:** 03 (core model), 04 (parser), 05 (formatters)
- **Blocks:** nothing
- **Standards reference:** https://www.xml-cml.org/, CML v2.4 + v3 spec
  (Murray-Rust, Rzepa, Wright et al.)

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

## Scope

### Formatter (Model → CML)

`lib/asciichem/formatter/cml.rb` — `class Cml < Base`, registered
via the standard `Formatter[:cml]` interface. Each `visit_<class>`
method emits the corresponding CML element:

| Model class            | CML element                                              |
| ---------------------- | ------------------------------------------------------- |
| `Formula`              | `<cml>` root containing every top-level node            |
| `Molecule`             | `<molecule id="m1">` with optional stereo attribute     |
| `Atom`                 | `<atom id="a1" elementType="C" formalCharge="2+" hydrogenCount="..." isotopicMass="14" .../>` |
| `Group`                | `<molecule>` wrapper with `count` attribute for multiplicity |
| `Bond`                 | `<bond atomRefs2="a1 a2" order="S/D/T/..."/>`           |
| `Reaction`             | `<reaction>` with `<reactantList>` / `<productList>` / `<reactantCondition>` |
| `ReactionCascade`      | A sequence of `<reaction>` elements linked via `id`s    |
| `ElectronConfiguration`| `<electronConfiguration>` (custom extension if no CML standard exists) |
| `EmbeddedMath`         | `<scalar>` carrying the math source, or `<math>` if Plurimath can emit CML-compatible math |
| `Text`                 | `<name>` or comment depending on context                |

Atom IDs (`a1`, `a2`, ...) and bond references must be generated
deterministically so the output is reproducible.

### Parser (CML → Model)

`lib/asciichem/cml/parser.rb` — uses Nokogiri to parse the XML and
build the model tree. Mirror of the AsciiChem text parser API:
`AsciiChem::Cml.parse(cml_xml) -> AsciiChem::Model::Formula`.

The parser must handle the full v0.2 model surface. CML's semantics
are richer than AsciiChem's (e.g. 3D coordinates, spectra), so any
CML feature we don't model yet should be captured as a diagnostic
(warning) rather than silently dropped.

### Round-trip conformance

`spec/conformance/cml_round_trip_spec.rb` — for every AsciiChem
snippet in the existing round-trip suite:

1. Parse AsciiChem → Model.
2. Model → CML (via the new formatter).
3. CML → Model (via the new parser).
4. Compare models 1 and 4 — they must be equal.
5. Optionally: Model 4 → CML again must byte-equal Model 2's CML
   modulo insignificant whitespace.

This is the strictest correctness check we have.

### CLI

Add `-t cml` and a new `parse-cml -i INPUT.xml` command.

### Spec page

`src/content/docs/reference/cml.mdx` — explains:

- What CML is and why AsciiChem supports it.
- The mapping table above, with worked examples.
- Limitations (features CML has that we don't yet model; vice versa).
- Verifying round-trip with the CLI.

### Architecture

CML is conceptually a sibling of MathML/HTML/LaTeX/SVG, not a
replacement. The formatter lives under `Formatter::Cml` and registers
through the same `Formatter[:cml]` registry. Adding it is one new
file plus one autoload entry — pure OCP.

The CML parser is a separate class (`AsciiChem::Cml::Parser`)
parallel to `AsciiChem::Parser` (which handles AsciiChem text). The
model they produce is identical; the choice of parser depends on
input format.

## What this enables

- **Round-trip proof** of model completeness (stronger than the
  current text-only round-trip).
- **CML-tool ecosystem access** — AsciiChem content becomes a
  first-class citizen in chemistry toolchains.
- **Publication submission** to venues that require CML.
- **Future SMILES/InChI conversion** — many converters accept CML
  as input.

## What's out of scope

- **3D coordinates.** CML carries them; AsciiChem's model doesn't
  (yet). TODO 18 (2D structural via elk-rb) might add a `geometry`
  field that the CML formatter could populate.
- **Spectroscopy / crystallography blocks.** CML has extensive
  support; AsciiChem's model doesn't cover these.
- **Polymer notation**. Green Book §2.10 mentions; CML has it; we
  don't model it.
- **Reaction kinetics.** CML supports `<reactionrate>` etc.; out of
  scope for v0.2.

## Acceptance criteria

- [ ] `AsciiChem.parse("H_2O").to_cml` produces well-formed CML XML
      parseable by Nokogiri without warnings.
- [ ] `AsciiChem::Cml.parse(cml)` produces a `Model::Formula`
      equivalent to the AsciiChem-parsed form of the same content.
- [ ] Round-trip suite passes for every canonical input.
- [ ] CLI `convert -i "..." -t cml` and `parse-cml -i "<xml>..."`.
- [ ] Spec page `reference/cml.mdx` documents the mapping with
      worked examples.
- [ ] CI runs CML round-trip on every PR.
