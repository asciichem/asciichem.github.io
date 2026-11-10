# 21 — Linter pass (balancing, valence, charge)

- **Priority:** P3
- **Status:** pending
- **Depends on:** 03, 04

## Motivation

The parser accepts any syntactically valid input. It doesn't reject
unbalanced reactions or impossible valences. A separate linter pass
catches chemistry errors without bloating the grammar.

This is intentionally a **linter**, not a parser feature. The parser
remains total; the linter is opt-in via CLI `asciichem lint`.

## Scope

- `AsciiChem::Linter` (new class) with a registry of checks. Each
  check is a small visitor that walks the model and collects
  `Diagnostic` objects (`{ severity:, message:, node: }`).
- Checks (v1 set):
  - `BalanceCheck` — reactions must have equal atom counts on both
    sides (with stoichiometric coefficients applied).
  - `ValenceCheck` — each atom's total bond order + charge ≤ max
    valence for the element.
  - `BracketBalanceCheck` — group brackets open/close in matched
    pairs (already enforced by grammar, but linter verifies post-
    transform).
  - `IsotopeSanityCheck` — isotope mass ≥ element's atomic number
    (rough table required).
- CLI: `asciichem lint -i "..."` runs all checks, prints diagnostics
  sorted by severity.
- Exit codes: 0 if no errors (warnings OK), 1 if errors.
- Element table: `lib/asciichem/elements.rb` with atomic numbers and
  common valences for the first 96 elements. Encoded as a hash, not
  external data.

## Acceptance

- `asciichem lint -i "H_2 + O_2 -> H_2O"` warns: "Reaction unbalanced
  (H: 2 vs 2, O: 2 vs 1)".
- `asciichem lint -i "CH_5"` errors: "Carbon valence exceeded (5
  bonds, max 4)".
- Each check has spec coverage with both passing and failing inputs.
