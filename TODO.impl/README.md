# TODO.impl index

All remaining work to ship AsciiChem v0.1 and lay the groundwork for v1.
Each file describes one unit of work with priority, dependencies,
motivation, scope, and acceptance criteria. Files are numbered in
priority order; sub-priorities inside a number are sequential.

Move a file to `archived/` only after its work is merged on **both** sides
of the paired ecosystem (this repo + `../asciichem-ruby`). See
`CLAUDE.md` for the ecosystem layout.

## P1 — Foundation (blocks all later work)

| # | Title | Repo | Status |
|---|---|---|---|
| 01 | [Research standards](01-research-standards.md) | site | pending |
| 02 | [Gem scaffold](02-gem-scaffold.md) | gem | **done** (PR asciichem-ruby#1) |
| 03 | [Core model](03-core-model.md) | gem | **done** (PR asciichem-ruby#1) |
| 04 | [Parser and transform](04-parser-transform.md) | gem | **done** (PR asciichem-ruby#1) |
| 05 | [MathML and Text formatters](05-formatters-mathml-text.md) | gem | **done** (PR asciichem-ruby#1) |
| 06 | [Specs and conformance](06-specs-and-conformance.md) | gem | **done** (PR asciichem-ruby#1) |
| 09 | [Site scaffold (Starlight + Tailwind 4 + MDX)](09-site-scaffold.md) | site | **done** (PR asciichem.github.io#1) |
| 10 | [Site gem integration](10-site-gem-integration.md) | site | pending |
| 11 | [Spec content pages](11-site-spec-content.md) | site | **done** (PR asciichem.github.io#1) |

## P2 — Extended features and content

| # | Title | Repo | Status |
|---|---|---|---|
| 07 | [Other formatters (HTML, LaTeX, SVG)](07-other-formatters.md) | gem | pending |
| 08 | [CLI](08-cli.md) | gem | partial (CLI written; specs deferred) |
| 12 | [Examples and walkthroughs](12-site-examples.md) | site | partial (one examples page; expansion deferred) |
| 13 | [Extended constructs](13-extended-constructs.md) | gem | pending |
| 14 | [Embedded Plurimath math](14-embedded-plurimath-math.md) | gem | partial (grammar parses backticks; integration specs deferred) |
| 15 | [Architecture doc](15-architecture-doc.md) | both | pending |

## P3 — Polish and release

| # | Title | Repo | Status |
|---|---|---|---|
| 16 | [CI and release](16-ci-and-release.md) | both | partial (CI workflows added; release doc deferred) |
| 17 | [Site polish](17-site-polish.md) | site | pending |

## Dependency graph

```
01 ─┐
    ├─► 03 ─┬─► 04 ─┬─► 05 ─► 06
02 ─┘       │       ├─► 13
            │       ├─► 14
            ├─► 07 ─┤
            └─► 15  └─► 08 ─┐
                            ├─► 10 ─┬─► 11 ─┬─► 12
09 ─────────────────────────┘       │       ├─► 17
                                    │       └─► 16
                                    └─► 16
```

## Conventions

- **Status field** in each TODO file: `pending`, `in-progress`, `done`,
  `blocked`. Update before/after each work session.
- **Cross-repo dependencies** are flagged in the body. When a TODO spans
  both repos, open one PR per repo and link them.
- **No surprise deletions.** When a TODO is done, move (don't delete) to
  `archived/`. Originals and source material are never deleted (global
  rule).
