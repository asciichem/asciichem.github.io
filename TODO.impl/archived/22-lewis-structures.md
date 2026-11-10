# 22 — Lewis structures and lone pairs

- **Priority:** P3
- **Status:** pending
- **Depends on:** 18 (structural layout)

## Motivation

Lewis structures show every valence electron: bonds as line pairs,
lone pairs as dots. Essential for teaching and for reaction mechanism
analysis. mhchem has no native support; chemfig uses TikZ markup.

## Scope

- **Model:** `Atom` gains `lone_pairs` (Integer) and `radical_electrons`
  (Integer, 0/1/2) fields. `Bond` is unchanged.
- **Grammar:** prefix markers `:` for lone pair, `·` for radical —
  but these need disambiguation from text. Likely `.X` for radical
  (`Cl.`), and dot count for lone pairs (`:O:` for water's oxygen
  with two lone pairs).
- **Formatters:**
  - SVG (needs elk-rb): render atoms with dots around them per lone
    pair count.
  - MathML: dots as `<mo>·</mo>` or `<mo>:</mo>` adjacent to the
    atom.
  - Text: emit the original prefix/suffix spelling.
- **Spec page:** `syntax/lewis.mdx` with worked examples (H₂O, NH₃,
  CO₂, NO radical).

## Acceptance

- `AsciiChem.parse(":O:")` parses with `lone_pairs: 2` on the oxygen.
- SVG output draws two dots above and two dots below the O.
- Round-trip preserves lone-pair and radical markers.
