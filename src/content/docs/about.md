---
title: About AsciiChem
description: The story, name, logo, and mission of the AsciiChem project.
---

import { Card, CardGrid } from "@astrojs/starlight/components";

# About AsciiChem

## The name

**AsciiChem** is a portmanteau of **Ascii** (the character set) and
**Chem** (chemistry). It follows the same naming pattern as
[AsciiMath](https://asciimath.org/) — a plain-keyboard syntax for a
domain that traditionally required typesetting.

The lowercase "A" in the logo wordmark is a nod to AsciiMath, the
project that inspired this one. Where AsciiMath tackles mathematics
typography, AsciiChem tackles **chemistry** semantics.

## The logo

The AsciiChem logo is a stylised atom: a central nucleus with three
elliptical orbits at 60-degree rotations. The atom is rendered in the
project's primary green (`#0c4a3e`) — a colour chosen for its
association with growth, biology, and the chemical industry's
sustainability pivot.

- **Central nucleus** — the semantic model at the heart of every parse.
- **Three orbits** — the three primary output formats (MathML, HTML,
  LaTeX/SVG).
- **Even rotation** — model-driven design: every format gets equal
  treatment, none privileged over the others.

## Origin

AsciiChem was created to close the gap that AsciiMath leaves open:
chemistry is not math typography. Prefix isotopes (`^14C`), reactions
with conditions (`N_2 + 3H_2 <=>[Fe][400°C] 2NH_3`), electron
configurations, and Lewis markers all have no clean AsciiMath spelling.

The project ships two artefacts:

- A **Ruby gem** (`asciichem-ruby`) — the reference parser and renderer.
- A **specification site** (this site) — the user-facing documentation
  with live-rendered examples.

The two repos are kept in lockstep: every construct documented on the
site is implemented in the gem, and every gem feature is documented
here.

## Mission

AsciiChem's mission is **plain-keyboard chemistry**: anything a chemist
can type on a standard keyboard, AsciiChem should be able to parse into
a semantic model and render to any supported output format.

Constraints that shape every design decision:

1. **Plain ASCII.** No Unicode arrows, no LaTeX commands, no special
   characters that aren't on a US keyboard.
2. **Model-driven.** Every parse produces a typed tree. Render to any
   format without round-tripping through text.
3. **Round-trippable.** `parse(s).to_text == s` for any canonical `s`.
4. **IUPAC-aligned.** Where AsciiChem's spelling differs from `mhchem`,
   the IUPAC Green Book is the tiebreaker.
5. **Open/closed.** New constructs are new model classes; new outputs
   are new formatters. Existing code stays untouched.

## The ecosystem

| Project | Role |
|---------|------|
| [asciichem-ruby](https://github.com/asciichem/asciichem-ruby) | The reference parser and renderer gem |
| [asciichem.github.io](https://github.com/asciichem/asciichem.github.io) | This specification site |
| [plurimath](https://github.com/plurimath/plurimath) | Embedded math (AsciiChem wraps Plurimath for math expressions) |
| [mn/elk-rb](https://github.com/mn) | 2D structural diagram layout (planned integration) |

## Use cases

<CardGrid stagger>
  <Card title="Publications" icon="open-book">
    Type chemistry formulae in Markdown,AsciiDoc, or plain text and
    have them render consistently across HTML, PDF, and print.
  </Card>
  <Card title="Education" icon="pencil">
    Students learn chemistry with a syntax they can type on any
    keyboard — no LaTeX, no special software required.
  </Card>
  <Card title="Tooling" icon="setting">
    Programmatic chemistry: parse, validate (via the linter), and
    render in build pipelines.
  </Card>
  <Card title="Migration" icon="arrow-undo">
    Convert existing `mhchem` content to a format that survives
    outside LaTeX. The LaTeX formatter emits `\ce{...}` for
    round-tripping.
  </Card>
</CardGrid>

## Standards alignment

AsciiChem is designed against:

- **IUPAC Green Book** (3rd ed., 2007) — quantities, units, and symbols
  in physical chemistry.
- **IUPAC Recommendation 2018** — inorganic chemistry formula
  nomenclature.
- **LaTeX `mhchem`** — formula-level syntax (we borrow and adapt).
- **LaTeX `chemfig`** — structural-diagram concepts (deferred to v0.3+
  via elk-rb integration).

Where these sources disagree, the IUPAC Green Book wins. See
[IUPAC mapping](/reference/iupac-mapping/) for the full decision
table.

## Open source

AsciiChem is open source under the BSD-2-Clause license.

- **GitHub organisation**: [github.com/asciichem](https://github.com/asciichem)
- **Contributing**: PRs welcome — read [Getting started](/guides/getting-started/) for the development workflow.
- **Issues**: bug reports and feature requests on the respective
  GitHub issue trackers.

## Get started

1. **Install the gem**: `gem install asciichem`
2. **Read the syntax tour**: [Syntax overview](/syntax/)
3. **Try the examples**: [Common formulae](/examples/common-formulae/)
4. **Join the community**: star the repos and open issues.

---

*Open source project maintained by [Ribose](https://www.ribose.com).*
