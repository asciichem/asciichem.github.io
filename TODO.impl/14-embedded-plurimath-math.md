# 14 — Embedded Plurimath math

- **Priority:** P2
- **Status:** pending
- **Depends on:** 03, 04

## Motivation

Chemistry publications embed math (`K_c = [P]/[R]`, Arrhenius, rate
laws). AsciiChem should not reinvent math typography — it should embed
Plurimath formulae. This is the explicit project goal.

## Scope

- `EmbeddedMath` model class already exists (TODO 03). It holds a
  `Plurimath::Math::Formula`.
- Parser: a backtick-delimited run (`​`...`​`) is captured as raw text
  and passed to `Plurimath::Asciimath.new(text).to_formula`. The result
  is wrapped in `EmbeddedMath`.
- Formatters:
  - MathML: call `.to_mathml` on the wrapped formula, strip outer
    `<math>` if necessary.
  - Text: emit the backtick-wrapped source back.
- One syntax page: `syntax/embedded-math.mdx` showing usage.

## Acceptance

- ``AsciiChem.parse("`K_c = [P]/[R]`")`` produces a Formula containing
  one EmbeddedMath.
- The embedded formula is a real Plurimath formula, not a string.
- MathML output for the embedded math matches what Plurimath would
  produce directly.
