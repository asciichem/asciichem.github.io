# 63 — Parsanol 1.3.13 re-check

- **Priority:** P3
- **Status:** done (2026-09-14) — not adopted; correctness gate green, native blocked upstream
- **Depends on:** parsanol-ruby ≥ 1.3.13 (native-by-default + RepetitionTag)

## Motivation

The first parsanol investigation (2026-09-14, recorded in
`asciichem-ruby/benchmarks/README.md`) measured the compat shim ~6×
slower than parslet and hit an EOF/repetition bug. The revisit
trigger was: native backend engaged, EOF fixed, beat parslet on the
shared workload. Upstream landed "native by default" + RepetitionTag
in 1.3.13; this TODO is the re-check.

## Findings (spike: `benchmarks/parsanol_recheck.rb`)

1. **Corpus correctness is there.** Unmodified grammar through
   `Parsanol::Parslet` compat (`:ruby` forced): **221/221**
   parse/reject/round-trip cases identical to parslet. Issue-25
   EOF repro (`SO_4^2-`) parses and round-trips.
2. **One gem-side divergence fixed** (0.28.1): parsanol's transform
   delivers cascade tails as scalar hashes; `CascadeBuilder`
   used `Array(hash)`, which enumerates a Hash. Now wraps
   explicitly; spec'd for all three engine shapes.
3. **Perf (compat `:ruby`):** ~1.7× slower than parslet same-session
   (was ~6×). Correct, not a win.
4. **Native still cannot serialize full parslet grammars** — two
   upstream bugs (reported on parsanol-ruby#25):
   - `native.rb` never loads `native/dynamic` → NameError silently
     falls back to `:ruby`
   - `Dynamic.register` never increments `@next_id` → Rust panic on
     the second lazily-bound rule ("callback ID 1000000 already
     registered")

## Verdict

**Not adopted.** One small upstream fix away from a meaningful
native re-measure. Revisit trigger updated: native serialization
survives a multi-rule grammar, then beat parslet end-to-end, then
adopt.

## Acceptance

- Re-check documented; upstream follow-up posted; cascade fix
  shipped (0.28.1); parslet path unaffected.
