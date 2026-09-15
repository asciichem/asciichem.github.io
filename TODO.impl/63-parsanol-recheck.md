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

**Not adopted — one upstream one-liner away.** Revisit trigger
(native serialization survives a multi-rule grammar) is now MET for
everything except embedded math; the speed condition is met at 3.2x.

## Re-check 3 (2026-09-15, parsanol 1.3.15)

- Native routing engages for the full grammar: **219/221 corpus cases
  green** (only the two embedded-math inputs fail — the still-unfixed
  `@next_id` dynamic collision, parsanol-ruby#25 third comment)
- **3.2x faster than parslet** (4.28 vs 13.64 ms per 10-input pass,
  same session)
- Separate upstream note: `H2` / `_2O` accepted under native but
  rejected under parslet (optimizer run-merging semantics; not
  corpus-covered today)
- `benchmarks/parsanol_recheck.rb` gained `PARSANOL_MODE` and a
  fork-per-case gate (Rust aborts reported, not fatal)

Next: when upstream lands `@next_id += 1`, run the gate to 221/221
and decide the engine-switchable design (opt-in, soft dependency).

## Acceptance

- Re-check documented; upstream follow-up posted; cascade fix
  shipped (0.28.1); parslet path unaffected.
