# 05 — MathML and Text formatters

- **Priority:** P1 (foundation)
- **Status:** pending
- **Depends on:** 03, 04
- **Blocks:** 06

## Motivation

Two outputs are mandatory for v1: MathML (presentation, for browser
rendering via MathJax/MathML natively) and AsciiChem text (round-trip
conformance). Other formats (HTML, LaTeX, SVG) come later (TODO 08).

## Scope

`lib/asciichem/formatter.rb` — `module Formatter` with autoloads.

`lib/asciichem/formatter/base.rb` — `class Base`. Defines the visitor
skeleton: one `visit_<ClassName>` method per model class. Default
implementation raises `NotImplementedError` so gaps surface immediately
(no silent omissions).

`lib/asciichem/formatter/mathml.rb` — `class Mathml < Base`. Produces a
MathML `<math>` document as a String. Key rules:

- `Atom` → `<mi>element</mi>` with `<msup>`/`<msub>`/`<msubsup>` for
  suffix markers, and `<msup>` wrapping the whole `Atom` for prefix
  isotope (this is the structural fix — isotope is on the atom, not on a
  phantom).
- Charges render as `<msup>` with `<mrow>` containing number + sign.
- `Group` → `<mrow>...</mrow>` with multiplicity as a trailing
  `<msub>` whose base is the inner `<mrow>`.
- `Reaction` → reactants, then `<mo>` for the arrow entity (e.g.
  `&#x21CC;` for equilibrium), then products. Conditions render via
  `<mover>`/`<munder>` on the arrow.
- `ElectronConfiguration` → orbital + `<msup>` occupancy.
- `EmbeddedMath` → delegate to the wrapped Plurimath formula's
  `to_mathml`. Strip the outer `<math>` to embed cleanly.

MathML is constructed via a small `XmlBuilder` helper
(`lib/asciichem/xml_builder.rb`) that uses Nokogiri::XML::Builder if
available, else pure-string with escaped attributes. This is presentation
rendering, not model serialization — does not violate the no-hand-rolled
rule.

`lib/asciichem/formatter/text.rb` — `class Text < Base`. Produces the
canonical AsciiChem source. Round-trip: `AsciiChem.parse(s).to_text == s`
for any conformant `s`. The formatter is the canonicalizer — equivalent
inputs map to the same output.

## Acceptance

- `AsciiChem.parse("H_2O").to_mathml` produces a `<math>` element with
  `<mi>H</mi><msub><mi></mi><mn>2</mn></msub>...` — wait, no: the
  semantic fix says `<msub><mi>H</mi><mn>2</mn></msub>` directly. The H
  is the base.
- `AsciiChem.parse("^14C").to_mathml` produces
  `<msup><mi>C</mi><mn>14</mn></msup>` (no empty `<mi/>`).
- Round-trip suite (TODO 10) passes for all v1 constructs.
- Formatter specs cover every model class.
