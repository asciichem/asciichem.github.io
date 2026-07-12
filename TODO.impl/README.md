# TODO.impl index

All remaining work to ship AsciiChem v0.1 and lay the groundwork for v1+.
Each file describes one unit of work with priority, dependencies,
motivation, scope, and acceptance criteria. Files are numbered in
priority order; sub-priorities inside a number are sequential.

Move a file to `archived/` only after its work is merged on **both** sides
of the paired ecosystem (this repo + `../asciichem-ruby`). See
`CLAUDE.md` for the ecosystem layout.

## v0.1 — Foundation (DONE)

All P1/P2/P3 items below this header shipped in the initial PRs
(asciichem-ruby#1, asciichem.github.io#1) plus the post-merge polish
PRs.

| # | Title | Repo | Status |
|---|---|---|---|
| 01 | [Research standards](01-research-standards.md) | site | **done** |
| 02 | [Gem scaffold](02-gem-scaffold.md) | gem | **done** |
| 03 | [Core model](03-core-model.md) | gem | **done** |
| 04 | [Parser and transform](04-parser-transform.md) | gem | **done** |
| 05 | [MathML and Text formatters](05-formatters-mathml-text.md) | gem | **done** |
| 06 | [Specs and conformance](06-specs-and-conformance.md) | gem | **done** |
| 07 | [Other formatters (HTML, LaTeX, SVG)](07-other-formatters.md) | gem | **done** |
| 08 | [CLI](08-cli.md) | gem | **done** |
| 09 | [Site scaffold](09-site-scaffold.md) | site | **done** |
| 10 | [Site gem integration](10-site-gem-integration.md) | site | **done** |
| 11 | [Spec content pages](11-site-spec-content.md) | site | **done** |
| 12 | [Examples and walkthroughs](12-site-examples.md) | site | **done** |
| 13 | [Extended constructs (linear bonds)](13-extended-constructs.md) | gem | **done** (linear bonds; 2D structural supersedes the rest) |
| 14 | [Embedded Plurimath math](14-embedded-plurimath-math.md) | gem | **done** |
| 15 | [Architecture doc](15-architecture-doc.md) | both | **done** |
| 16 | [CI and release](16-ci-and-release.md) | both | **done** |
| 17 | [Site polish (OG, link check, a11y)](17-site-polish.md) | site | **done** (visual baselines split to TODO 23) |

## v0.2+ — Forward roadmap

These TODOs cover work identified during v0.1 implementation. Each is
prioritised on its own merits.

| # | Title | Repo | Status |
|---|---|---|---|
| 18 | [2D structural formulae via elk-rb](18-2d-structural-via-elk-rb.md) | gem | pending — blocks 19, 22 |
| 19 | [Stereochemistry markers (R/S, E/Z)](19-stereochemistry.md) | gem | pending — depends on 18 |
| 20 | [Reaction cascades (multi-step)](20-reaction-cascades.md) | gem | **done** (PR asciichem-ruby#3) |
| 21 | [Linter pass (balancing, valence)](21-linter.md) | gem | **done** — registry framework + BracketBalance + IsotopeSanity checks; valence/balance checks still pending |
| 22 | [Lewis structures and lone pairs](22-lewis-structures.md) | gem | pending — depends on 18 |
| 23 | [Visual regression baselines](23-visual-regression.md) | site | pending (infra in place) |
| 24 | [Parser fuzzing corpus](24-parser-fuzzing.md) | gem | **done** (PR asciichem-ruby#3) — 15 corpus files |
| 25 | [Performance benchmarks](25-performance-benchmarks.md) | gem | **done** (PR asciichem-ruby#4) |

## Dependency graph (v0.2+)

```
18 ─┬─► 19
    ├─► 22
    └─► (SVG formatter extension)
20 (independent)
21 (independent)
23 (independent)
24 (independent)
25 (independent)
```

## Conventions

- **Status field** in each TODO file: `pending`, `in-progress`, `done`,
  `blocked`. Update before/after each work session.
- **Cross-repo dependencies** are flagged in the body. When a TODO spans
  both repos, open one PR per repo and link them.
- **No surprise deletions.** When a TODO is done, move (don't delete) to
  `archived/`. Originals and source material are never deleted (global
  rule).
