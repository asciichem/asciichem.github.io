# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The source for the **AsciiChem** specification website — a public Astro site
documenting an ASCII syntax for representing chemical formulas, reactions,
electron configurations, bonds, and structural diagrams in plain keyboard text.

AsciiChem is to chemistry what AsciiMath is to mathematics. The syntax is
ASCII-only, model-based (every parse produces a semantic tree), and
round-trippable (model → AsciiChem text reproduces the input).

This repo is **specification-only**. The reference implementation lives in the
sibling Ruby gem at `../asciichem-ruby` (see "Paired ecosystem" below).

## Why AsciiMath is insufficient for chemistry (project motivation)

AsciiMath's data model assumes math typography, not chemistry semantics. The
specific gaps this project must close:

1. **Prefix superscripts/subscripts.** Chemistry routinely writes prefixed
   isotopic / charge markers (`^14C`, `_6Li`, `Ca^2+`). AsciiMath has no way
   to bind these to a following atom without an empty `{}` carrier
   (`{}^14C`), which is semantically wrong: the prefix belongs to the atom,
   not to a phantom element.
2. **Formulas and reactions.** No native syntax for stoichiometric
   coefficients, reaction arrows (`->`, `<=>`, equilibrium), conditions
   above/below arrows, or spectator ions.
3. **Electron configuration and quantum state.** No representation for
   filled/unfilled orbitals, term symbols (`^3P_2`), spin multiplicity, or
   quantum wells.
4. **Bonds and structural diagrams.** No syntax for single/double/triple/
   dative bonds, ring structures, stereo wedges, or skeletal formulae — all
   things LaTeX's `chemfig` provides.
5. **IUPAC symbol conventions** (see References) that have no AsciiMath
   analogue.

When designing syntax, the test is: *can a chemist type this on a plain
keyboard, and does the parse tree capture the chemistry semantics — not just
the typography?*

## Paired ecosystem

This project is split across two repos that must stay in sync. The split
mirrors the plurimath ecosystem layout.

| Repo | Path from here | Role |
|---|---|---|
| `asciichem.github.io` | `.` (this repo) | Astro spec site, examples, renderings |
| `asciichem-ruby` | `../asciichem-ruby` | Parser gem: AsciiChem → model → MathML/SVG |

When a spec page describes syntax, the gem must implement it; when the gem
adds a feature, a spec page must document it. Cross-repo changes belong in
the same logical unit of work and should reference each other in their
commit/PR messages.

## Reference projects (read these before starting)

Treat these as the architectural templates. Do not invent new patterns when
an established one exists.

| Concern | Reference | Path |
|---|---|---|
| Astro spec site layout | Primmel | `../../primmel/primmel.github.io` |
| Ruby parser gem structure | Plurimath | `../../plurimath/plurimath` |
| Math model + MathML output | Plurimath::Math | `../../plurimath/plurimath/lib/plurimath/math` |
| AsciiMath parser/transform | Plurimath::Asciimath | `../../plurimath/plurimath/lib/plurimath/asciimath` |
| Diagram rendering (elk-rb) | mn/elk-rb | `../../mn/elk-rb` (may not yet exist locally) |

Primmel's `CLAUDE.md` is the canonical guide for the Astro side: layout
hierarchy (BaseLayout → DocLayout/PageLayout), content collections with Zod
schemas, derived navigation, single `app.css` entry, Vue island hydration
strategy, performance budgets, and the testing matrix (Vitest / axe /
Playwright / link checker).

Plurimath is the canonical guide for the gem side: `parslet` parser →
`transform` → semantic `Formula` model → format-specific renderers
(`Mathml`, `Html`, `Latex`, `Omml`, `UnicodeMath`), each open for extension
and closed for modification. AsciiChem's gem reuses Plurimath's
`Plurimath::Math::Formula` as the inner math model so chemistry can embed
math (e.g. equilibrium constants) without bridge code.

## Standards and source material (the spec basis)

The spec must be defensible against external authorities. Cite these:

- **IUPAC Recommendation** — *Pure Appl. Chem.* **90** (2018) 175–180.
- **IUPAC Green Book** — *Quantities, Units and Symbols in Physical
  Chemistry*, 3rd ed. (2007), RSC Publishing.
  https://www.iupac.org/fileadmin/user_upload/publications/e-resources/ONLINE-IUPAC-GB3-2ndPrinting-Online-Sep2012.pdf
- **LaTeX `mhchem`** — https://ctan.org/pkg/mhchem (formula syntax).
- **LaTeX `chemfig`** — https://ctan.org/pkg/chemfig (structural diagrams).
- **Overleaf chemistry overview** —
  https://www.overleaf.com/learn/latex/Chemistry_formulae (survey of
  chemistry-related LaTeX packages).

When in doubt about a symbol or convention, the IUPAC Green Book is
authoritative. When choosing an ASCII spelling for a construct, prefer
`mhchem`'s established syntax (chemists already know it) over inventing a
new one — unless `mhchem`'s syntax conflicts with AsciiMath parsing, in
which case document the divergence explicitly.

## Build / develop (to be set up)

The site targets the same toolchain as Primmel. Until the scaffolding
exists, the commands below are the *intended* set; verify against
`package.json` once present.

```bash
npm install
npm run dev          # Astro dev server
npm run build        # build + search index + OG images → dist/
npm run preview      # preview the production build
npm run check        # astro check (TypeScript + Astro type checking)
npm test             # Vitest unit specs
npm run check:links  # validate internal links
npm run check:a11y   # axe-core WCAG 2 AA audit
npm run test:visual  # Playwright visual regression
```

For the sibling gem (`../asciichem-ruby`), the Plurimath command set is the
target: `bundle exec rspec`, `bundle exec rubocop`, `bundle exec rake`.

## Architecture (target state)

### Site (this repo)

Mirror Primmel's structure. Key invariants:

- **Content collections, typed with Zod.** Spec pages live in
  `src/content/` and frontmatter is validated at build time.
- **Derived navigation.** Sidebars and pagers are computed from collection
  metadata — no hardcoded nav arrays.
- **Rendered examples are model-driven.** Each spec example embeds an
  AsciiChem snippet plus its rendered MathML/SVG output. The build step
  shells out to `../asciichem-ruby` (or imports the compiled gem via a
  build-time script) to produce the rendering. The site never reimplements
  the parser — the gem is the single source of truth for parsing.
- **OCP layout hierarchy.** `BaseLayout → DocLayout / PageLayout`. New page
  types extend, never modify.
- **Single CSS entry** (`src/styles/app.css`) with Tailwind 4 `@theme`
  tokens; MECA sections (tokens, base, code, tables, a11y, diagrams).
- **Zero-JS by default.** Vue islands hydrate selectively
  (`client:load`, `client:idle`, `client:visible`).

### Gem (`../asciichem-ruby`)

Mirror Plurimath's structure. Key invariants:

- **Parslet parser → transform → model.** Same shape as
  `Plurimath::Asciimath`.
- **The model is the canonical form.** AsciiChem text, MathML, and any
  future format are all *views* over the model. There is no
  text-to-MathML shortcut that bypasses the model.
- **Math embeds use Plurimath.** A stoichiometric coefficient, an
  equilibrium expression, a term symbol's math — these are
  `Plurimath::Math::Formula` instances. Do not reinvent math typography.
- **Format renderers are OCP.** Adding SVG output is a new renderer module,
  not edits to the MathML renderer. Each renderer is registered, not
  switch-cased.
- **Diagrams delegate to elk-rb.** Structural formulae (skeletal, rings,
  stereo) render through `mn/elk-rb` to SVG. The gem emits the graph
  description; elk-rb lays it out.

## Domain model (the chemistry semantics)

The model must distinguish things AsciiMath collapses together. Sketch
(extend as the spec matures):

- `Atom` — element symbol, optional isotope (prefix superscript), optional
  charge (prefix or suffix), optional oxidation state.
- `Molecule` — ordered list of `Atom` / group nodes with subscript
  multiplicity.
- `Group` — parenthesised sub-formula, multiplier applies to the group.
- `Bond` — type (single/double/triple/dative/wedge/hash), endpoints.
- `Reaction` — reactants, products, arrow type (`->`, `<=>`, equilibrium,
  resonance), conditions (over/under the arrow).
- `ElectronConfiguration` — orbital occupancy, term symbol, spin.
- `Math` — embedded `Plurimath::Math::Formula` for quantities and equations.

A prefix superscript/subscript binds to the *next* atom or group, never to
an empty carrier. This is the core semantic fix over AsciiMath and must be
enforced by the parser.

## Workflow

### TODO.impl

All remaining work is tracked as individual files in `TODO.impl/` named
`{n}-{slug}.md` where `{n}` is a priority-ordered integer. Each file
describes one unit of work: motivation, scope, acceptance criteria, and
cross-repo dependencies. Create a file per unit; complete them in priority
order; delete the file (or move to an `archived/` subdirectory) only after
the work is merged on both sides of the ecosystem.

### Branches and PRs

Per the global CLAUDE.md: never commit to main, never push tags, never push
to main. Every change goes through a PR. For cross-repo changes (spec page
+ gem feature), open one PR per repo and link them in the descriptions.

### Verification before claiming done

- Site work: run `npm run check` and `npm run build`; for UI changes,
  spin up the dev server and exercise the feature in a browser. Type
  checking does not verify feature correctness.
- Gem work: run `bundle exec rspec`; for parser changes, add round-trip
  specs (parse → text → parse equality) — the model is the contract, and
  round-tripping is how we know it held.

## Critical constraints (project-specific; the global CLAUDE.md has more)

- **Never hand-roll serialization on the gem side.** All (de)serialization
  goes through `lutaml-model` with `attribute` + `mapping` declarations.
  No `to_h`/`from_h` key-swapping. See global CLAUDE.md "NEVER HAND-ROLL
  SERIALIZATION".
- **Never use `require_relative` or path-based `require` for internal gem
  code.** Use Ruby `autoload`, declared in the immediate parent
  namespace's file. See global CLAUDE.md rule 9.
- **No `double()` in specs.** Use real model instances or lightweight
  `Struct`s. See global CLAUDE.md "NEVER USE DOUBLES IN SPECS".
- **Never reimplement the parser in the site.** If the site needs to render
  an example, it calls the gem. A second parser in TypeScript would
  silently drift from the canonical Ruby one.
- **Never delete source files** (original artwork, reference PDFs,
  upstream `mhchem`/`chemfig` package sources downloaded for study, IUPAC
  PDFs). The site may inline derived SVG/PNG, but the originals stay. See
  global CLAUDE.md ABSOLUTE RULE on this topic.
