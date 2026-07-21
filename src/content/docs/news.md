---
title: News
description: AsciiChem project news, release notes, and design deep-dives.
---

Project news, release announcements, and design deep-dives from the
AsciiChem team.

## 2026-07-21 — AsciiChem v0.11: Native CML wire complete

v0.11.0 completes the native-wire migration arc for every
beyond-formulas construct. ZMatrix, Calculation, Mechanism, and
reaction conditions now join Crystal (v0.9) and Spectrum (v0.10)
in using native CML wire representations.

| Construct | v0.10 wire | v0.11 wire |
|---|---|---|
| ZMatrix | `<aci:zmatrix>` text | `<zMatrix>` inside `<molecule>` |
| Calculation | `<aci:calculation>` text | `<propertyList>` of `<property>` |
| Mechanism | `<aci:mechanism>` text | `<mechanism>` inside `<reaction>` |
| Conditions | `aci:conditionsAbove` attrs | `<conditionList>` of `<scalar>` |

Other CML tools — Avogadro, Open Babel, Jmol, Mnova, ACD/Labs —
can now read **all** AsciiChem output natively without needing the
AsciiChem-specific `aci:` extension namespace. Backwards compat
preserved: legacy `aci:` text-carrier XML still parses correctly.

The native-wire migration arc (Phases 01–06 of TODO.complete) is
now complete. Future work focuses on structural representation
(currently several constructs use text-form via title attribute;
structural length/angle/torsion children for ZMatrix and step-by-step
representation for Mechanism are future enhancements).

## 2026-07-21 — AsciiChem v0.10: Native CML wire for Spectrum

v0.10.0 continues the native-wire migration. Spectrum nodes now emit
as a `<molecule>` containing a native `<spectrum>` child (with
`format` and `condition` attributes for nucleus/solvent) plus a
`<peakList>` of `<peak>` elements. Each peak carries the standard
CML attributes: `xValue` (position), `yValue` (intensity),
`yMultiplicity` (s/d/t/q/m), and `title` (assignment).

Spectrometry tools that consume CML (Mnova, ACD/Labs, etc.) can now
read AsciiChem spectrum output directly. Legacy `aci:spectrum`
text-carrier XML still parses for backwards compat.

## 2026-07-21 — AsciiChem v0.9: Native CML wire for Crystal

v0.9.0 begins the migration from aci: text-carrier representation to
native CML wire for the beyond-formulas constructs. Crystal is first:
crystal nodes now emit as a `<molecule>` containing a native
`<crystal>` child (with `<scalar>` cells and `<symmetry
spaceGroup=...>`) plus an `<atomArray>` with fractional coordinates.

Other CML tools — Avogadro, Jmol, Open Babel, any CML-aware reader —
can now consume AsciiChem crystal output directly, without needing
the AsciiChem-specific `aci:` extension namespace.

Backwards compat preserved: legacy `aci:crystal` text-carrier XML
still parses correctly. The next releases will migrate Spectrum,
ZMatrix, Mechanism, Calculation, and reaction conditions to native
wire following the same pattern.

## 2026-07-21 — AsciiChem v0.8: chemicalml 0.3.0 + Hydrogen implicit subscripts

Two releases today, both addressing long-standing feature requests.

### v0.8.0 — chemicalml 0.3.0 dependency

chemicalml 0.3.0 fixes the wire serialization gaps that had blocked
native CML round-trip for Crystal / Spectrum / ZMatrix / Mechanism /
Calculation / reaction conditions. Molecule wire now serializes
`<crystal>`, `<spectrum>`, `<zMatrix>`, `<propertyList>` children;
Reaction wire now serializes `<conditionList>`, `<spectatorList>`,
`<mechanism>` children.

This unblocks the native-wire migration for the beyond-formulas
constructs. The current aci: namespace carriers remain as a
fallback; future releases will migrate each construct to its native
CML form.

v0.8.0 also adds a manual-dispatch GHA release workflow
(`.github/workflows/release.yml`) so gem pushes no longer require
maintainer laptops.

### v0.7.0 — Implicit subscripts on Hydrogen

Casual chemistry notation uses `H2O`, `CH4`, `NH3` without explicit
underscores. AsciiChem now accepts both forms.

The feature is **Hydrogen-only** because bare digits after other
elements are already used for SMILES-style ring closures
(`C1-C-C-C-C-C1` is cyclohexane). Hydrogen cannot form ring closures
(only one bond), so bare digits after `H` are unambiguously
subscripts. This covers ~99% of the actual user need (formula
notation like `H2O`, `H2SO4`, `C6H12O6`) without breaking
structural notation.

For other elements, use the explicit form: `O_3`, `S_2`, `N_2`.

## 2026-07-14 — AsciiChem v0.2: the semantic model

v0.2 is the release that gives AsciiChem a **real chemistry model**.
Every parse now produces a typed tree — `Atom`, `Molecule`, `Bond`,
`Reaction`, `ReactionCascade`, `ElectronConfiguration`, `EmbeddedMath` —
that formatters walk via the visitor pattern.

### What shipped

- **Semantic model.** Eleven model classes with `accept(visitor)` and
  `children()` hooks. The model is the hub; formatters are the spokes.
- **Six output formats.** MathML, HTML, Text (canonicaliser), LaTeX
  (`\ce{}` via mhchem), SVG (inline), and Structural SVG (via elkrb).
- **Round-trip guarantee.** `parse(s).to_text == s` for any canonical
  input. The Text formatter is the canonicaliser.
- **Prefix isotopes done right.** `^14C` binds 14 to the atom — not to
  an empty phantom base like AsciiMath.
- **Bonds.** Single, double, triple, wedge (`>-`), hash (`-<`), dative
  (`~>`), and aromatic (`~~`). All ASCII-spelled.
- **Reactions.** Four arrow types (`->`, `<-`, `<=>`, `<->`), with
  conditions above and below the arrow.
- **Electron configurations.** `[Ar] 3d^6 4s^2` parses to a real model
  that can be queried for valence shells.
- **Embedded math.** Backtick escapes hand content to Plurimath.
- **Linter.** Balance check, valence check, bracket-balance check,
  isotope sanity check — all registry-driven (OCP).
- **CLI.** `asciichem convert`, `parse-cml`, `roundtrip`, `lint`,
  `version`. Package name is `asciichem`.

### What's deferred

- **CML round-trip** — the `chemicalml` gem has been refactored to a
  Schema3 namespace; the translator needs realignment. Specs are
  pending, not failing.
- **Structural SVG** — elkrb layout is integrated but bond connectivity
  needs a fix; flat molecules work, branched structures do not.
- **Greek words in conditions** — `alpha`, `beta`, `gamma` parse in
  stereo prefixes but not yet in reaction conditions.

Read the full breakdown on the [What's new in v0.2](/guides/whats-new/)
page.

## Planned posts

- **Why we picked `~>` for the dative bond** — ASCII has no dative-bond
  convention. `~>` was chosen to avoid collision with the reaction arrow
  (`->`) while evoking the donation direction.
- **The semantic fix: prefix isotopes bind to atoms** — a deep-dive
  into why `^14C` and `{}^14C` are semantically different.
- **Comparing mhchem and AsciiChem** — where the two syntaxes agree,
  where they disagree, and why we pick our spots.
- **The canonical model architecture** — three concerns kept MECE:
  `AsciiChem::Model` (syntax), `Chemicalml::Model` (canonical),
  `Chemicalml::Cml` (wire format). The translator is the only thing
  that bridges them.
- **Linter as first-class concern** — the registry-driven linter
  design and how `BalanceCheck`, `ValenceCheck`, and
  `IsotopeSanityCheck` self-register at load time.
