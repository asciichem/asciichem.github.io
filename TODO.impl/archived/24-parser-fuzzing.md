# 24 — Parser fuzzing corpus

- **Priority:** P3
- **Status:** pending
- **Depends on:** 04

## Motivation

parslet grammars fail loudly on ParseFailed, but unexpected
combinations of constructs can surface as NoMethodError, NameError,
or infinite loops. A fuzzing corpus runs the parser over many inputs
to catch these.

## Scope

- `spec/fuzz/corpus/` — directory of `.asciichem` files with weird
  inputs:
  - deeply nested groups
  - long coefficient runs
  - mixed brackets (`([{}])`)
  - empty conditions `[A][]B`
  - every Unicode character outside the grammar's alphabet
  - malformed prefix markers (`^`, `^^^A`, `_A`)
- `spec/fuzz/corpus_spec.rb` — iterates the directory, asserts each
  input either parses successfully or raises `ParseError` (never a
  different error class).
- Corpus is hand-curated, not random — every file represents a
  specific edge case someone thought about.

## Acceptance

- `bundle exec rspec spec/fuzz/` runs the corpus.
- No input raises a non-ParseError exception.
- Corpus has at least 50 entries covering every grammar production.
