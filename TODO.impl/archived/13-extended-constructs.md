# 13 — Extended constructs

- **Priority:** P2
- **Status:** pending
- **Depends on:** 03, 04, 05

## Motivation

v1 covers atoms, molecules, basic bonds, reactions, electron config. v2
extends to the cases IUPAC and mhchem support that we deferred.

## Scope

- **Oxidation state** — `Fe^(II)`, `Mn^(VII)`. Roman numerals in
  superscript, parens to disambiguate from charge.
- **Wedge/hash/dative bonds** — `A >- B` (wedge), `A -< B` (hash),
  `A -> B` (dative — arrow with lone pair donor). ASCII spellings TBD
  via TODO 01; document the choice.
- **Equilibrium arrow conditions** — `A <=>[catalyst][temp] B`
  (above/below). Parsed into `Reaction#conditions`.
- **Resonance arrow** — `<->` or `|->`. Parsed into `Reaction#arrow =
  :resonance`.
- **Stereochemistry markers** — E/Z, cis/trans, R/S — as attributes on
  bonds or atoms.
- **Multiplicative prefixes** — Greek prefixes (`di`, `tri`) for
  molecular names, if in scope (likely out — names are not formulae).

Each construct adds a model field or class, a parser production, and a
formatter case. OCP: model and formatter visit methods, not switch
statements.

## Acceptance

- Each construct has a spec, a spec page, and a worked example.
- No regressions in the round-trip suite.
