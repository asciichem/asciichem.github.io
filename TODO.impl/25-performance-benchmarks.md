# 25 — Performance benchmarks

- **Priority:** P3
- **Status:** pending
- **Depends on:** 04, 05

## Motivation

parslet is a PEG parser; it isn't the fastest option. For interactive
use it's fine. For batch conversion of large corpora (e.g. a journal
archive), throughput matters. Benchmarks surface regressions and
guide optimisation.

## Scope

- `benchmarks/` directory with `benchmark.rb` using the stdlib
  `Benchmark` module plus `benchmark-ips` gem.
- Suites:
  - Parse small molecules (1000 iterations of `H_2O`).
  - Parse complex reactions (100 iterations of Haber process).
  - Round-trip (parse + to_text).
  - MathML rendering of a typical page (50 examples).
  - Large input (one 10 KB formula — pathological but real).
- `benchmarks/RESULTS.md` records baseline numbers on the maintainer's
  machine. CI doesn't run benchmarks; they're manual.

## Acceptance

- `bundle exec ruby benchmarks/benchmark.rb` runs all suites.
- RESULTS.md has baseline numbers.
- Numbers regressions flagged in PR review (manual).
