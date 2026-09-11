# 54 — Migrate the site games' inline parser to asciichem-ts

- **Priority:** P3
- **Status:** pending
- **Repos:** asciichem.github.io

## Problem

`src/scripts/asciichem-cli.ts` (~38 KB) is a hand-rolled TS
mini-parser used by the playground games (MoleculeGame,
ChemistryPlayer, QuizGame). It predates the single-contract rule and
will drift from the reference grammar. Games are not
correctness-critical paths, but drift means teaching users syntax
the real parser rejects (or missing syntax it accepts).

## Plan

1. Replace the mini-parser's parse/validate calls with
   `import { parse } from "asciichem"` (already a dependency since
   TODO 53).
2. Keep game-specific scoring/sound logic; only the syntax layer
   changes.
3. Delete the hand-rolled grammar portions — after the maintainer
   confirms nothing else imports them (global rule: never delete
   source files without explicit confirmation).

## Acceptance

- Games behave identically on their challenge sets.
- `asciichem-cli.ts` contains no grammar logic, only game utilities.
