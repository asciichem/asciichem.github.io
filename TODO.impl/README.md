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
| 18 | [2D structural formulae via elk-rb](18-2d-structural-via-elk-rb.md) | gem | pending — **elkrb now available** at `claricle/elkrb` (12 layout algorithms) |
| 19 | [Stereochemistry markers (R/S, E/Z)](19-stereochemistry.md) | gem | **done** (model + grammar + formatters) — 2D layout needs TODO 18 |
| 20 | [Reaction cascades (multi-step)](20-reaction-cascades.md) | gem | **done** (PR asciichem-ruby#3) |
| 21 | [Linter pass (balancing, valence)](21-linter.md) | gem | **done** — BalanceCheck + ValenceCheck + BracketBalanceCheck + IsotopeSanityCheck |
| 22 | [Lewis structures and lone pairs](22-lewis-structures.md) | gem | **done** (model + grammar + formatters) — 2D layout needs TODO 18 |
| 23 | [Visual regression baselines](23-visual-regression.md) | site | pending (infra in place) |
| 24 | [Parser fuzzing corpus](24-parser-fuzzing.md) | gem | **done** (PR asciichem-ruby#3) — 15 corpus files |
| 25 | [Performance benchmarks](25-performance-benchmarks.md) | gem | **done** (PR asciichem-ruby#4) |
| 26 | [CML round-trip](26-cml-round-trip.md) | gem | **done** — chemml gem + AsciiChem::Cml::Translator |
| 27 | [Canonical chemistry representation model](27-canonical-chem-model.md) | gem | **done** — Chemml::Model + Chemml::Cml::Translator |
| 28 | [CML spec page on site](28-cml-spec-page.md) | site | **done** (PR asciichem.github.io#11) |

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

## v2 — TODO.v2 execution backlog

These TODOs execute the v2 strategy that lives at the workspace root
(`~/src/asciichem/TODO.v2/` — strategy documents) following the
glossarist ecosystem pattern (`concept-model` → ruby/js
implementations). Each file names the TODO.v2 plan it implements.

| # | Title | Repo | Status |
|---|---|---|---|
| 29 | [asciichem-model scaffold](29-asciichem-model-scaffold.md) | new `asciichem-model` | in-progress (TODO.v2 01) |
| 30 | [Model node schemas + canonical wire](30-model-node-schemas.md) | `asciichem-model` | pending (TODO.v2 01) |
| 31 | [Identity model schemas](31-identity-model-schemas.md) | `asciichem-model` | pending (TODO.v2 01) |
| 32 | [Model type generator + validators](32-model-type-generator.md) | `asciichem-model` | pending (TODO.v2 01) |
| 33 | [asciichem-tests scaffold](33-asciichem-tests-scaffold.md) | new `asciichem-tests` | pending (TODO.v2 02) |
| 34 | [Corpus migration + identifier fixtures](34-corpus-migration.md) | `asciichem-tests` | pending (TODO.v2 02) |
| 35 | [Identifier validators + linter checks](35-identifier-validators.md) | gem | **done** (TODO.v2 07 L1) |
| 36 | [ADR-0001 language bindings](36-adr-language-bindings.md) | `asciichem-model` | **done** (TODO.v2 04) |
| 37 | [Gem intake of model + corpus](37-gem-model-intake.md) | gem | pending (TODO.v2 03) |
| 38 | [Resolver framework + cache](38-resolver-framework.md) | gem | pending (TODO.v2 07 L2) |
| 39 | [PubChem adapter](39-pubchem-adapter.md) | gem | pending (TODO.v2 07 L2) |
| 40 | [Common Chemistry adapter](40-common-chemistry-adapter.md) | gem | blocked: maintainer licence sign-off (TODO.v2 07 L2) |
| 41 | [CLI resolve/validate](41-cli-resolve-validate.md) | gem | pending (TODO.v2 07 L3) |
| 42 | [SMILES reader/writer](42-smiles-interop.md) | gem | pending (TODO.v2 09) |
| 43 | [Molfile reader/writer](43-molfile-interop.md) | gem | pending (TODO.v2 09) |
| 44 | [Citation builder + profiles + CLI](44-citation-builder.md) | gem | pending (TODO.v2 08) |
| 45 | [Cite syntax + CML mapping](45-cite-syntax.md) | gem + site | pending (TODO.v2 08) |
| 46 | [TypeScript API](46-typescript-api.md) | new `asciichem-ts` | pending on 36 (TODO.v2 05) |
| 47 | [Python API](47-python-api.md) | new `asciichem-py` | pending on 36 (TODO.v2 06) |
| 48 | [InChI engine + cross-check](48-inchi-engine.md) | gem + engines | pending (TODO.v2 10) |
| 49 | [metanorma-asciichem](49-metanorma-asciichem.md) | new MN gem | pending (TODO.v2 08) |
| 50 | [Site v2 guides](50-site-guides-v2.md) | site | pending (TODO.v2 07/08) |
| 51 | [Interactive playground](51-playground.md) | site + `asciichem-ts` | pending on 46 (TODO.v2 12) |
| 52 | [Spec-suite truncation (pre-existing)](52-rspec-suite-truncation.md) | gem | **P1** — diagnosed 2026-09-09, fix pending |

## Status snapshot (2026-09-09)

- **Done:** 35 (identifier validators + 2 linter checks + 35 spec
  examples, all green), 36 (ADR-0001).
- **In progress:** 29 — `asciichem-model` scaffolded at the workspace
  root (seed schemas atom/molecule/identifier + lutaml defs +
  examples + self-check specs green); git init + PR pending.
- **Open bug:** 52 — the gem's full spec suite terminates early with
  randomly truncated example counts (pre-existing, reproduced on
  pristine main; dry-run collection is stable at 788). Fixed before
  trusting CI signal for anything else.

## Conventions

- **Status field** in each TODO file: `pending`, `in-progress`, `done`,
  `blocked`. Update before/after each work session.
- **Cross-repo dependencies** are flagged in the body. When a TODO spans
  both repos, open one PR per repo and link them.
- **No surprise deletions.** When a TODO is done, move (don't delete) to
  `archived/`. Originals and source material are never deleted (global
  rule).
