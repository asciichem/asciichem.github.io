# TODO.impl index

**Backlog complete (2026-11-10).** Every unit below is done and merged
across its repos; all files live in `archived/`. Forward work now
lives in `TODO.v2/` at the workspace root (strategy) and the SOTA
goal doc (`TODO.v2/13-sota-goal.md`). New execution units should be
numbered 67+ here.

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
| 01 | [Research standards](archived/01-research-standards.md) | site | **done** |
| 02 | [Gem scaffold](archived/02-gem-scaffold.md) | gem | **done** |
| 03 | [Core model](archived/03-core-model.md) | gem | **done** |
| 04 | [Parser and transform](archived/04-parser-transform.md) | gem | **done** |
| 05 | [MathML and Text formatters](archived/05-formatters-mathml-text.md) | gem | **done** |
| 06 | [Specs and conformance](archived/06-specs-and-conformance.md) | gem | **done** |
| 07 | [Other formatters (HTML, LaTeX, SVG)](archived/07-other-formatters.md) | gem | **done** |
| 08 | [CLI](archived/08-cli.md) | gem | **done** |
| 09 | [Site scaffold](archived/09-site-scaffold.md) | site | **done** |
| 10 | [Site gem integration](archived/10-site-gem-integration.md) | site | **done** |
| 11 | [Spec content pages](archived/11-site-spec-content.md) | site | **done** |
| 12 | [Examples and walkthroughs](archived/12-site-examples.md) | site | **done** |
| 13 | [Extended constructs (linear bonds)](archived/13-extended-constructs.md) | gem | **done** (linear bonds; 2D structural supersedes the rest) |
| 14 | [Embedded Plurimath math](archived/14-embedded-plurimath-math.md) | gem | **done** |
| 15 | [Architecture doc](archived/15-architecture-doc.md) | both | **done** |
| 16 | [CI and release](archived/16-ci-and-release.md) | both | **done** |
| 17 | [Site polish (OG, link check, a11y)](archived/17-site-polish.md) | site | **done** (visual baselines split to TODO 23) |

## v0.2+ — Forward roadmap

These TODOs cover work identified during v0.1 implementation. Each is
prioritised on its own merits.

| # | Title | Repo | Status |
|---|---|---|---|
| 18 | [2D structural formulae via elk-rb](archived/18-2d-structural-via-elk-rb.md) | gem | **done** — StructuralSvg + Layout (elkrb, deterministic layered) |
| 19 | [Stereochemistry markers (R/S, E/Z)](archived/19-stereochemistry.md) | gem | **done** (model + grammar + formatters) — 2D layout needs TODO 18 |
| 20 | [Reaction cascades (multi-step)](archived/20-reaction-cascades.md) | gem | **done** (PR asciichem-ruby#3) |
| 21 | [Linter pass (balancing, valence)](archived/21-linter.md) | gem | **done** — BalanceCheck + ValenceCheck + BracketBalanceCheck + IsotopeSanityCheck |
| 22 | [Lewis structures and lone pairs](archived/22-lewis-structures.md) | gem | **done** (model + grammar + formatters) — 2D layout needs TODO 18 |
| 23 | [Visual regression baselines](archived/23-visual-regression.md) | site | **done** — component suite enforced in CI (21 ubuntu baselines); full-page quarantined with evidence |
| 24 | [Parser fuzzing corpus](archived/24-parser-fuzzing.md) | gem | **done** (PR asciichem-ruby#3) — 15 corpus files |
| 25 | [Performance benchmarks](archived/25-performance-benchmarks.md) | gem | **done** (PR asciichem-ruby#4) |
| 26 | [CML round-trip](archived/26-cml-round-trip.md) | gem | **done** — chemml gem + AsciiChem::Cml::Translator |
| 27 | [Canonical chemistry representation model](archived/27-canonical-chem-model.md) | gem | **done** — Chemml::Model + Chemml::Cml::Translator |
| 28 | [CML spec page on site](archived/28-cml-spec-page.md) | site | **done** (PR asciichem.github.io#11) |

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
| 29 | [asciichem-model scaffold](archived/29-asciichem-model-scaffold.md) | new `asciichem-model` | **done** — contract-repo pattern (de-gemged via 59) |
| 30 | [Model node schemas + canonical wire](archived/30-model-node-schemas.md) | `asciichem-model` | **done** — v1 node schemas (v0.2.0) |
| 31 | [Identity model schemas](archived/31-identity-model-schemas.md) | `asciichem-model` | **done** — identifier + substance-record schemas |
| 32 | [Model type generator + validators](archived/32-model-type-generator.md) | `asciichem-model` | **done** — validators + TS type generator (v0.2.0) |
| 33 | [asciichem-tests scaffold](archived/33-asciichem-tests-scaffold.md) | new `asciichem-tests` | **done** (TODO.v2 02) |
| 34 | [Corpus migration + identifier fixtures](archived/34-corpus-migration.md) | `asciichem-tests` | **done** — corpus migration complete (v0.2.0) |
| 35 | [Identifier validators + linter checks](archived/35-identifier-validators.md) | gem | **done** (TODO.v2 07 L1) |
| 36 | [ADR-0001 language bindings](archived/36-adr-language-bindings.md) | `asciichem-model` | **done** (TODO.v2 04) |
| 37 | [Gem intake of model + corpus](archived/37-gem-model-intake.md) | gem | **done** — vendored schemas + corpus in CI |
| 38 | [Resolver framework + cache](archived/38-resolver-framework.md) | gem | **done** — resolver + TTL cache (gem#59) |
| 39 | [PubChem adapter](archived/39-pubchem-adapter.md) | gem | **done** — PubChem adapter (gem#59) |
| 40 | [Common Chemistry adapter](archived/40-common-chemistry-adapter.md) | gem | **done** — opt-in, licence-safe default-off |
| 41 | [CLI resolve/validate](archived/41-cli-resolve-validate.md) | gem | **done** — `resolve` + `validate` (gem#59) |
| 42 | [SMILES reader/writer](archived/42-smiles-interop.md) | gem | **done** — SMILES (0.21) |
| 43 | [Molfile reader/writer](archived/43-molfile-interop.md) | gem | **done** — molfile (0.21); `--from` (0.22) |
| 44 | [Citation builder + profiles + CLI](archived/44-citation-builder.md) | gem | **done** — Citation + `cite` CLI (0.25) |
| 45 | [Cite syntax + CML mapping](archived/45-cite-syntax.md) | gem + site | **done** — `@cite` syntax (0.26) |
| 46 | [TypeScript API](archived/46-typescript-api.md) | new `asciichem-ts` | **done** — npm 0.1.1, OIDC + provenance |
| 47 | [Python API](archived/47-python-api.md) | new `asciichem-py` | **done** — PyPI 0.1.0, OIDC |
| 48 | [InChI engine + cross-check](archived/48-inchi-engine.md) | gem + engines | **done** — binary adapter + IdentityCrossCheck + CLI; vendoring/licence follow-up is maintainer-gated (TODO.v2 10) |
| 49 | [metanorma-asciichem](archived/49-metanorma-asciichem.md) | new MN gem | **done** — [metanorma-plugin-asciichem 0.1.0](https://github.com/metanorma/metanorma-plugin-asciichem) (metanorma org, plugin family): [chem] blocks to MathML stems, @cite to InChIKey-anchored dataset bibitems; standoc wiring PR metanorma/metanorma-standoc#1255; release pending maintainer TP + tag |
| 50 | [Site v2 guides](archived/50-site-guides-v2.md) | site | **done** — structures-and-resolution + citing-substances (`@cite` syntax) landed |
| 51 | [Interactive playground](archived/51-playground.md) | site + `asciichem-ts` | **done** — live modes incl. MathML + URL-fragment sharing |
| 52 | [Spec-suite truncation (pre-existing)](archived/52-rspec-suite-truncation.md) | gem | **done** — fixed in asciichem-ruby#52 |
| 53 | [Site live renderer + /models page](archived/53-site-live-renderer-models.md) | site, ts | **done** — asciichem-ts v0.1.0 + this PR |
| 54 | [MoleculeGame answer equivalence via real parser](archived/54-site-games-parser-migration.md) | site | **done** |
| 55 | [Model fields for external structures](archived/55-model-structure-fields.md) | model | **done** — v0.4.0 |
| 56 | [SMILES/molfile corpus fixtures](archived/56-structure-corpus.md) | tests | **done** — v0.3.0 |
| 57 | [Ruby SMILES + molfile implementation](archived/57-ruby-structure-interchange.md) | gem | **done** — #55 |
| 58 | [TypeScript SMILES + molfile implementation](archived/58-ts-structure-interchange.md) | ts | **done** — ts#2 |
| 59 | [De-gem asciichem-model](archived/59-degem-asciichem-model.md) | model, gem, site | **done** — model#12, gem#57 |
| 60 | [CLI --from smiles/molfile](archived/60-cli-from-structure.md) | gem | **done** — 0.22.0 |
| 61 | [MathML parity (L2 corpus)](archived/61-mathml-parity.md) | tests, gem, ts, py, model | **done** — 21 goldens, all three implementations byte-identical; stereo now survives wire v1 |
| 62 | [MathML relies on mml contract model](archived/62-mml-reliance.md) | gem | **done** — embedded math via typed Mml graph; emission validated under Mml.parse |
| 63 | [Parsanol 1.3.13 re-check](archived/63-parsanol-recheck.md) | gem | **done** — 221/221 corpus-green under compat; native blocked upstream (not adopted) |
| 64 | [Opt-in Parsanol engine](archived/64-parsanol-engine.md) | gem | **done** — same rules over the Rust core, 1981/0 under both engines, 2.4x; 0.29.0 |
| 65 | [elkrb 2.0 migration](archived/65-elkrb-2-migration.md) | gem | **done** — single layout seam, floor ~> 2.0, goldens byte-identical |
| 66 | [Native InChI engine](archived/66-native-inchi.md) | inchi-tests, inchi-rs, inchi-engine | **done** (2026-11-10) — full port byte-exact vs the 1.07.5 oracle, ledger zero, corpus v0.3.41; shipped across runtimes (crates.io / npm wasm / PyPI / RubyGems) |

## Historical snapshots

- **2026-09-09:** 33/35/36/52 done; repos asciichem-model +
  asciichem-tests created; PRs asciichem-ruby#52, site #31.
- **2026-11-10:** backlog complete — every unit 01–66 merged and
  archived (see the banner above).

## Conventions

- **Status field** in each TODO file: `pending`, `in-progress`, `done`,
  `blocked`. Update before/after each work session.
- **Cross-repo dependencies** are flagged in the body. When a TODO spans
  both repos, open one PR per repo and link them.
- **No surprise deletions.** When a TODO is done, move (don't delete) to
  `archived/`. Originals and source material are never deleted (global
  rule).
