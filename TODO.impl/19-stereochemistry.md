# 19 — Stereochemistry markers (R/S, E/Z)

- **Priority:** P2
- **Status:** pending
- **Depends on:** 18 (structural layout)

## Motivation

Stereochemistry is core to organic and biochemistry. (R)- and (S)-
enantiomers, (E)- and (Z)-alkenes, α/β anomers — all need syntax.

## Scope

- **Model:** `Atom` gains optional `stereo` field (`:r`, `:s`, `:e`,
  `:z`, `:alpha`, `:beta`, `nil`).
- **Grammar:** prefix syntax `(R)-`, `(S)-`, `(E)-`, `(Z)-` before the
  atom/group they modify. Postfix `α`/`β` for anomers (Unicode) —
  document the ASCII alternatives (`(a)`, `(b)`) for round-trip.
- **Formatters:**
  - MathML: `<mtext>(R)</mtext>` prefix.
  - LaTeX: `\ce{(R)-A}` (mhchem convention).
  - SVG: label near the chiral atom (needs elk-rb integration).
- **Spec page:** `syntax/stereochemistry.mdx` documenting the syntax
  with worked examples (lactic acid, limonene, glucose anomers).

## Acceptance

- `AsciiChem.parse("(R)-CH(OH)COOH")` parses with stereo on the
  chiral carbon.
- Round-trip preserves stereo prefix.
- One worked example per convention (R/S, E/Z, α/β).
