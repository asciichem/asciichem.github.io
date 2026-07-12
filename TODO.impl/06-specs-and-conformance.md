# 06 — Comprehensive specs and round-trip conformance

- **Priority:** P1 (foundation)
- **Status:** pending
- **Depends on:** 03, 04, 05
- **Blocks:** release

## Motivation

The model is the contract. Specs enforce it. The round-trip conformance
suite is the strongest signal: if `parse(s).to_text == s` holds for every
input we consider canonical, the parser/formatter pair is internally
consistent.

## Scope

- `spec/spec_helper.rb` — requires `asciichem`, configures RSpec.
- `spec/asciichem/model/*.rb` — one spec per model class: instantiation,
  accessors, equality, validation. Real instances, no doubles (global
  rule).
- `spec/asciichem/parser_spec.rb` — one example per grammar production,
  asserting the parse tree shape via `AsciiChem.parse(...)` (not raw
  parslet output — test the public surface).
- `spec/asciichem/transform_spec.rb` — same inputs, asserting model
  instance types and key attributes.
- `spec/asciichem/formatter/mathml_spec.rb` — assert rendered XML matches
  expected fragments (string comparison against fixture strings).
- `spec/asciichem/formatter/text_spec.rb` — round-trip assertions.
- `spec/conformance/round_trip_spec.rb` — table-driven; reads
  `spec/conformance/cases.yml` (list of canonical AsciiChem snippets +
  their model assertions + round-trip expectation). Every case must parse
  without error, satisfy the model assertions, and round-trip exactly.
- `spec/integration/end_to_end_spec.rb` — complex inputs (real-world
  formulae from IUPAC examples, mhchem docs) and assert no parse failure.

## Acceptance

- `bundle exec rspec` runs all specs.
- Coverage > 90% on `lib/`.
- Round-trip conformance suite has ≥ 30 cases covering every construct.
- Zero uses of `double` (verify with `grep -rn 'double(' spec/`).
