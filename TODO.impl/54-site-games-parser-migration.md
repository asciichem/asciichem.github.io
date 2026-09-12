# 54 — MoleculeGame answer equivalence via the real parser

- **Priority:** P3
- **Status:** done (corrected 2026-09-12)
- **Repo:** asciichem.github.io

## Problem (corrected)

The original write-up claimed the games ran on a hand-rolled
mini-parser; that was a misreading — `src/scripts/asciichem-cli.ts`
is the easter-egg console (sound, achievements, element facts), not a
parser, and stays untouched. The real gap: MoleculeGame compared
answers by exact string match, so equivalent inputs (`H2O` vs
`H_2O`) were marked wrong even though the parser accepts them.

## Change

Answer checking canonicalises both sides through the
corpus-conformant `asciichem` package (already the live renderer's
dependency): any input whose canonical text equals the challenge's
canonical text is correct. Unparseable input simply fails (wrong
answer), preserving game behaviour on garbage.

## Acceptance

- `H2O` is accepted for water; malformed input is still wrong.
- No behavioural change to scoring/flow; the easter-egg console is
  untouched.
