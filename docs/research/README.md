# Research: external standards AsciiChem aligns with

This directory holds audits of the external standards and tools that
AsciiChem's syntax and model are designed against. Each file summarises
what the source covers and how AsciiChem borrows from or diverges from
it. The index below is the decision table.

The audits live in the site repo (not the gem) because they are
spec-level material: they inform syntax decisions, which are documented
on the site. The gem implements the syntax; the site justifies it.

## Index

| Source | File | Status |
|---|---|---|
| IUPAC Green Book (3rd ed., 2007) | [iupac-greenbook.md](iupac-greenbook.md) | audit complete |
| IUPAC Recommendation 2018 (Pure Appl. Chem. 90) | [iupac-greenbook.md](iupac-greenbook.md) | folded into Green Book audit |
| LaTeX `mhchem` | [mhchem.md](mhchem.md) | audit complete |
| LaTeX `chemfig` | [chemfig.md](chemfig.md) | audit complete |
| Overleaf chemistry survey | (covered by the two above) | n/a |

## Decision table

For every construct AsciiChem supports, the table below records the
spelling in each external source, the AsciiChem spelling, and the
reason for any divergence.

| Construct | IUPAC | mhchem | chemfig | AsciiChem | Why AsciiChem differs (or not) |
|---|---|---|---|---|---|
| Element symbol | `C`, `He` | `\ce{C}` | `C` | `C`, `He` | Same. |
| Isotope prefix | `^{14}C` | `\ce{^{14}C}` | `\cebelow` | `^14C` | Plain ASCII; no `{}` needed (digits only). |
| Charge | `Ca^{2+}` | `\ce{Ca^{2+}}` | — | `Ca^2+` | Plain ASCII; braces optional. |
| Oxidation state | `Fe^{(II)}` | `\ce{Fe^{II}}` (no parens) | — | `Fe^(II)` | Parens required to disambiguate from charge. |
| Stoichiometric coefficient | `2H_2O` | `\ce{2H2O}` | — | `2H_2O` | Explicit `_` for round-trip clarity. |
| Subscript | `H_2` | `\ce{H2}` (implicit) | — | `H_2` | Explicit `_` canonicalises inputs. |
| Group with multiplicity | `(OH)_2` | `\ce{(OH)2}` | — | `(OH)_2` | Explicit `_`. |
| Forward reaction | `A → B` | `\ce{A -> B}` | — | `A -> B` | Same. |
| Equilibrium | `A ⇌ B` | `\ce{A <=> B}` | — | `A <=> B` | Same. |
| Conditions above/below | `A ⇌_Fe^T B` | `\ce{A <=>[Fe][T] B}` | — | `A <=>[Fe][T] B` | mhchem syntax — direct lift. |
| Single bond | — | — | `\chemfig{A-B}` | `A-B` | Direct lift. |
| Double bond | — | — | `\chemfig{A=B}` | `A=B` | Direct lift. |
| Triple bond | — | — | `\chemfig{A=B=C}` | `A#B` | `#` for triple; chemfig reuses `=`. |
| Wedge bond | — | — | `\chembelow` / TikZ | `>-` | ASCII-friendly; chemfig needs TikZ. |
| Coordination complex | `[Fe(CN)_6]^{4-}` | `\ce{[Fe(CN)6]^{4-}}` | — | `[Fe(CN)_6]^4-` | Brackets preserved; charge on outer. |
| Embedded math | n/a | `\ce{...}` inside math | n/a | `` `...` `` | Backticks, like AsciiMath. |

## Principles applied

1. **Plain keyboard.** Anything a chemist can type without leaving the
   home row. No Unicode arrows in source (they appear in MathML output).
2. **IUPAC overrides mhchem** when they conflict. The Green Book is the
   authoritative reference for chemistry typography.
3. **mhchem overrides chemfig** for formula-level constructs, because
   mhchem is what chemists actually type in LaTeX.
4. **chemfig is the template** for structural diagrams, but AsciiChem
   keeps the linear-notation simple (single/double/triple bonds) and
   defers true skeletal formulae to SVG via `mn/elk-rb`.
5. **AsciiChem is not LaTeX.** No backslash commands. Constructs are
   positional and marker-based, like AsciiMath.

## Open questions

These decisions are not yet made; tracked in TODO 13:

- Stereochemistry markers (R/S, E/Z) — likely attribute syntax on
  bonds/atoms.
- Multi-center bonds (3-center-2-electron).
- Reaction cascades (chained arrows).
- Tautomeric arrows (distinct from resonance `<->`).
