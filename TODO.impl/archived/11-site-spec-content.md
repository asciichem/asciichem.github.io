# 11 — Spec content pages (Starlight docs)

- **Priority:** P1
- **Status:** pending
- **Depends on:** 09, 10
- **Blocks:** 12

## Motivation

The site exists to be the spec. Each construct gets a page with:
narrative, syntax summary, IUPAC/mhchem cross-reference (TODO 01), and
rendered examples (TODO 10).

## Scope

`src/content/docs/`:

- `index.mdx` — landing page: what AsciiChem is, why it exists (the
  AsciiMath gap), one-paragraph comparison with mhchem, get-started link.
- `overview/goals.mdx` — design goals (ASCII-only, model-driven,
  round-trippable, OCP).
- `overview/syntax-tour.mdx` — quick tour of every construct with a
  one-line example each.
- `syntax/atoms.mdx` — element symbols, prefix isotope (`^14C`), charge
  (`Ca^2+`), oxidation state (`Fe^(III)`).
- `syntax/molecules.mdx` — molecular formulae (`H_2O`, `Ca(OH)_2`),
  groups, brackets.
- `syntax/bonds.mdx` — single / double / triple / wedge / hash / dative /
  wavy bonds in linear notation; pointer to SVG rendering for structural
  formulae (TODO 07).
- `syntax/reactions.mdx` — forward / reverse / equilibrium / resonance
  arrows; conditions above / below the arrow.
- `syntax/electron-config.mdx` — orbital occupancy, term symbols.
- `syntax/embedded-math.mdx` — backtick math escape for equilibrium
  constants and friends.
- `reference/round-trip.mdx` — canonicalisation rules; what changes and
  what doesn't.
- `reference/iupac-mapping.mdx` — table mapping each AsciiChem construct
  to the IUPAC recommendation it implements.

Every page uses the `<AsciiChemExample>` component (TODO 10). Pages are
grouped in Starlight sidebar via `astro.config.mjs` sidebar config.

## Acceptance

- Every page builds without errors.
- Every page has at least one `<AsciiChemExample>` block.
- Starlight sidebar groups: Overview, Syntax, Reference.
- `npm run check:links` (or equivalent) reports zero broken internal
  links.
