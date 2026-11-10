# 61 — MathML parity across implementations (L2)

- **Priority:** P2
- **Status:** done
- **Implements:** single-contract rule extension; TODO.v2 04–06

## Motivation

MathML output existed only in the Ruby reference. The conformance
matrix could not claim MathML for TypeScript or Python, and nothing
pinned the reference itself against drift.

## Scope (shipped)

- Corpus suite `format/mathml/*` (21 golden cases, `since 0.4.0`):
  atoms (isotope prefix binding, charges, sub/superscripts,
  oxidation states, Lewis markers, ring closures), groups, bonds,
  reactions with conditions, cascades, electron configurations,
  stereo prefixes, coefficients, text nodes, annotation-invisible
  cases. Goldens generated from the reference implementation, then
  frozen.
- L2 level wired into all three conformance runners
  (ruby corpus_spec + conformance report, ts corpus.test.ts, py
  test_corpus.py). Exact-string comparison.
- `MathmlFormatter` ported to asciichem-ts (visitor, same model
  classes) and asciichem-py (dispatch table). Byte-identical with
  the reference on the corpus, verified in CI.
- Reference clean-ups the corpus surfaced:
  - electron-configuration separator emits a real U+00A0 (was a
    double-escaped entity artifact);
  - reaction conditions render in-place through the same formatter
    (was serialize → reparse → graft, which leaked an xmlns
    attribute and reset indentation);
  - molecule stereo markers (`(R)-`, `(alpha)-`) now survive the
    v1 wire form (additive optional `stereo` field; schema,
    generated types, and all three adapters updated).

## Known gap (follow-up)

- Embedded math (`` `...` ``) MathML in TS/py degrades to
  `<mtext>` with the raw source — the reference embeds
  Plurimath-rendered MathML. Spec'd in ts/py unit tests; excluded
  from corpus goldens until an AsciiMath engine is available
  cross-language.
- Corpus MathML coverage is formula-level; beyond-formula constructs
  (crystal/spectrum/calc/zmatrix/mechanism) are ported but not yet
  golden-pinned.

## Acceptance

- All three implementations pass every `format/mathml/*` golden
  byte-identically in CI; conformance matrix claims L2 for all.
