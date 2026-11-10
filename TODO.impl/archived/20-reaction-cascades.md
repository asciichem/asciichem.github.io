# 20 — Reaction cascades (multi-step reactions)

- **Priority:** P2
- **Status:** pending
- **Depends on:** 04 (parser)

## Motivation

Publications routinely show multi-step syntheses:

```
A -> B -> C -> D
```

v0.1 parses `A -> B` as one Reaction and stops. The cascade tail is
unreachable.

## Scope

- **Model:** `ReactionCascade` (new class) holding an ordered list of
  `Reaction` objects. Each step's products are the next step's
  reactants.
- **Grammar:** `reaction (arrow reaction)*` at the top level. The
  parser tries a single `reaction` first; if more arrows follow, it
  wraps the whole thing in `ReactionCascade`.
- **Formatters:**
  - MathML: `<mrow>` of consecutive reactions, with `<mo>)</mo>`
    separators if needed.
  - Text: emit each step on its own line OR chain inline.
  - LaTeX: `\ce{A -> B -> C -> D}` (mhchem handles this natively).
- **Spec page:** `syntax/cascades.mdx` with a worked synthesis example.

## Acceptance

- `AsciiChem.parse("A -> B -> C")` produces a `ReactionCascade` with
  two reactions.
- Round-trip preserves the chain order and arrow kinds.
- Mixed cascade with equilibrium arrows works:
  `A -> B <=> C -> D`.
