# 15 — Architecture doc (ARCHITECTURE.adoc)

- **Priority:** P2
- **Status:** pending
- **Depends on:** 02, 03, 05

## Motivation

The model is the contract; future contributors need to understand why
each class exists and how the pieces fit. A written architecture doc is
the durable reference (CLAUDE.md is for Claude, ARCHITECTURE.adoc is for
humans).

## Scope

`../asciichem-ruby/ARCHITECTURE.adoc`:

- **Layer diagram**: text → Parser → parse tree → Transform → Model →
  Formatter → MathML / HTML / SVG / Text.
- **Model class table**: class, role, key attributes, invariants
  (especially the prefix-isotope binding rule).
- **OCP manifest**: where the extension points are (new model class, new
  formatter, new syntax production).
- **Plurimath interop**: how math embedding works; what types cross the
  boundary.
- **Glossary**: Atom vs Molecule vs Group vs Bond vs Reaction vs
  ElectronConfiguration, with one-line definitions.

Also `docs/architecture.md` (in this site repo) — a public-facing
summary that the site can render as a doc page.

## Acceptance

- ARCHITECTURE.adoc written, covers every model class.
- A new contributor reading only ARCHITECTURE.adoc can add a new
  formatter without further guidance (OCP test).
