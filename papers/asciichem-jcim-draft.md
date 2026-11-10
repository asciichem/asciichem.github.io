# AsciiChem: a semantic plain-text syntax for chemistry in standards documents

*A working draft (JCIM-style Article). Not submitted. Numbers reflect
corpus release v0.10.0 and implementation state as of November 2026;
re-verify the counts in Tables 2 and 3 against the tagged corpora
before submission.*

## Abstract

Chemistry in standards documents is typically authored as typography:
subscripts, superscripts, arrows, and bracketed conditions carry no
machine-checkable semantics, so the substances a document names cannot
be validated, cross-referenced, or cited programmatically. We present
AsciiChem, a plain-keyboard syntax whose parse is a semantic model of
chemistry rather than a rendering of glyphs. Three properties
distinguish the design. First, prefixes bind to atoms structurally:
`^14C` parses as a carbon atom carrying isotope 14, never as a
superscript over a phantom carrier — the failure mode inherited from
AsciiMath-style notation. Second, the semantic model is a shared
contract: versioned wire schemas and a conformance corpus are the
normative artifacts, and four independent implementations (Ruby,
TypeScript, Python, Rust) are gated by the same fixtures, with seeded
differential generation extending coverage beyond hand-written cases.
Third, identity is part of the document layer: structures resolve to
authoritative records (PubChem, OPSIN, CAS Common Chemistry),
cross-validate against authored identifiers through a structure-aware
linter, and emit citation-grade dataset bibitems — one per (substance,
source) — anchored by InChIKey. InChI and InChIKey derivation is
provided by a native Rust engine gated byte-for-byte against a
5,627-structure oracle corpus recorded from the IUPAC reference
implementation. We report corpus-verified conformance levels per
implementation and a Metanorma pilot in which reactions, typed
condition roles, and cited substances compile into a standards-format
document.

## 1. Introduction

Standards documents name substances normatively. A method clause that
says "dissolve the residue in ethanol" is a claim about a specific
chemical, and checking that claim — is the formula right, is the
structure the substance the identifier names, is the cited record the
one asserted — is currently manual work. The tooling gap is not
rendering: LaTeX packages such as `mhchem` [1] and `chemfig` [2] and
word-processor add-ons typeset chemistry well. The gap is that the
authored text has no semantic model behind the rendering, so nothing
downstream can query it.

AsciiMath [3] solved the analogous problem for mathematics by defining
a plain-text syntax that renders reliably into MathML. Chemistry
breaks AsciiMath's assumptions in three places. Prefixes (isotopic
mass numbers, charges) and subscripts must bind to the atom they
decorate; AsciiMath, modeled on math typography, can only place them
on an empty carrier group such as `{}^14C`, which parses successfully
but assigns the isotope to a phantom base rather than to the carbon
atom. Reactions carry arrows, stoichiometry, and conditions above and
below the arrow, none of which are model data in a typographic tree.
Structures carry bonds, rings, and stereochemistry, which a
superscript/subscript grammar cannot express at all.

Treating chemistry as typography therefore cannot support the checks
that standards work requires. AsciiChem's design claim is that a
compact ASCII syntax can parse directly into a semantic model, that
the model can be shared as a versioned contract across independent
implementations, and that the model can carry substance identity from
structure to citation. This paper describes the syntax and the
atom-binding decision (Section 2), the shared contract and its
conformance machinery (Section 3), the identity and citation layer
(Section 4), the conformance evidence (Section 5), the limitations
(Section 6), related work (Section 7), and our conclusions
(Section 8).

## 2. Syntax and the atom-binding model

The syntax is deliberately close to what chemists already type and to
established conventions: `mhchem`-style formulas, SMILES-style ring
closures [4,5], and plain-ASCII arrows. Every input is typed on a
standard keyboard; there are no Unicode requirements. The defining
structural decision is that prefixes are parsed as part of the atom
token, not as floating superscripts and subscripts:

```
^14C          ->  Atom(element: "C", isotope: "14")
Ca^2+         ->  Atom(element: "Ca", charge: "2+")
_6Li          ->  Atom(element: "Li", isotope: "6")
                   (canonical text: ^6Li)
```

The binding mirrors the IUPAC nuclide convention itself, in which the
mass number is a left superscript on the element symbol [6]. A bare
`^14` with no following element is a parse error, not a floating
superscript. Table 1 summarizes the construct families and their model
bindings.

**Table 1.** AsciiChem construct families and the semantic nodes they
produce. All ASCII forms round-trip through the reference
implementation as shown.

| Construct family | ASCII form | Model node and fields |
|---|---|---|
| Isotopes | `^14C` | `Atom` with `isotope` bound to the element |
| Charges | `Ca^2+`, `SO_4^2-` | typed `charge` on atom or molecule |
| Coefficients | `2H_2O` | `Molecule` with `coefficient` |
| Groups | `(NH_4)_2SO_4` | nested `Group` with multiplier |
| Bonds | `C-C`, `C=C`, `C#C` | `Bond` with kind, optional direction |
| Ring closures | `C1-C-C-C-C-C1` | ring-closure digits on atoms |
| Stereo | `@R`/`@S` parity; `/\` directions | chirality labels, bond directions |
| Reactions | `A + B -> C` | `Reaction` with per-side members |
| Condition roles | `A ->[cat: Pd; solv: THF] B` | typed condition entries |
| Mechanisms | step bodies | step graph with electron-flow markers |
| Electron structure | `1s^2 2s^2 2p^6` | orbital occupancy nodes |

Round-tripping is the contract: `parse(text).to_text == text` for
canonical input, so the model is lossless with respect to the authored
form. The same structural discipline applies across the language — the
grammar captures semantic units and the transform builds typed nodes;
there is no typographic tree in the model.

Reactions gain typed data the typographic approach cannot express.
Stoichiometric coefficients are model fields, and a `stoichiometry`
service exposes normalized per-side coefficient maps that feed a
balance check. Condition brackets keep their authored text verbatim
while deriving typed role entries: `[cat: Pd; solv: THF]` yields
catalyst and solvent roles alongside the free-text fallback. Mechanism
bodies keep their steps verbatim and derive a step graph — parsed step
reactions, catalysts (species appearing on both sides of a step),
inter-step links, and electron-flow markers.

**Figure 1.** The atom-binding contrast. *Caption:* AsciiMath's
superscript operator attaches `14` to an empty base group, so the
isotope is never a property of the carbon; AsciiChem's atom token
carries the isotope directly, and a prefix with no following atom is
rejected at parse time. *Description for the illustrator:* left panel,
`{}^14C` in AsciiMath rendered as a superscript tree with an empty
base node highlighted; right panel, the AsciiChem parse tree
`Atom(element: C, isotope: 14)` with the isotope edge inside the atom
node; below each tree, the same input and its rejected form `^14`.

## 3. The shared contract

The normative artifact is not an implementation. Two contract
repositories define the language:

- **asciichem-model** — versioned JSON Schemas (schema set v1) for the
  wire form, with LUTAML model definitions and generated TypeScript
  types. Additions follow a documented additive rule (additive changes
  bump the patch line within v1); consumers vendor from release tags,
  and CI fails on drift between the model definitions and the schemas.
- **asciichem-tests** — the conformance corpus: parser
  acceptance/rejection, a fuzz corpus, identifier fixtures, linter
  expectations, CML round-trip [7], SMILES [4] and molfile [8]
  interchange, MathML goldens, condition-role and mechanism fixtures,
  perception semantics, and seeded generated models (wire JSON plus
  canonical text) shared by every implementation.

**Table 2.** Shared-corpus composition at release v0.10.0.

| Suite | Fixtures | Gated behavior |
|---|---|---|
| parser-acceptance | 20 | parse or reject exactly as marked |
| fuzz-corpus | 157 | rejection is clean (never a crash) |
| identifiers | 29 | annotation parsing and validity |
| linter-expectations | 6 | diagnostics match expectations |
| cml-roundtrip | 23 | three-way CML round-trip |
| smiles | 41 | structure ingestion and deterministic emission |
| molfile | 6 | V2000 ingestion and emission |
| mathml | 21 | byte-identical MathML goldens |
| conditions | 8 | typed condition-role derivation |
| mechanisms | 3 | step-graph derivation |
| perception | 20 | shared implicit-hydrogen and aromatic semantics |
| generated (seeded) | 300 | cross-implementation model equality |

Four implementations are gated by the same corpus: Ruby (the
reference), TypeScript, Python, and Rust; each clones the corpus at a
pinned tag in its own CI. The Rust implementation does not reimplement
the grammar by hand: the syntax is maintained as a PARG text contract
(asciichem-parg), compiled to a checksummed JSON artifact that the
Rust parser verifies at load time and runs on the parsanol engine.

Implementations claim conformance *levels*, cumulative and
corpus-verified: L0 (notation — parse, canonicalize, clean rejection),
L1 (semantics — typed model and wire round-trip), L2 (render —
byte-golden MathML, canonical text, wire), L3 (stereo — chirality and
directional bonds through every round-trip), and L4 (identity —
resolution, cross-validation, citation-grade records). A level claim
without the green corpus run behind it does not ship.

Differential generation closes the "explains its own fixtures" gap.
From a fixed seed, a property harness in the reference implementation
produces 300 valid models, emits each as wire JSON plus canonical
text, and every dynamic implementation must ingest the wire form,
render the exact canonical text, and re-parse to an equal model.
Every differential failure becomes a corpus fixture, so a bug fixed in
one implementation cannot silently regress in another.

The corpus discipline has a corollary worth stating: fixtures are
never edited to make an implementation pass. Where the contract
itself changes, the change ships as an explicit, versioned expectation
change. For example, canonical aromatic SMILES became the round-trip
target, so Kekulé input `C1=CC=CC=C1` now parses and emits the
lowercase aromatic form `c1ccccc1`; the fixture records the
canonicalization explicitly rather than silently rewriting the
expectation.

**Figure 2.** The single-contract conformance model. *Caption:* the
corpus and wire schemas are the normative artifacts; four independent
implementations gate against the same fixtures in their own CI; the
seeded differential set is re-generated into the corpus; the InChI
oracle corpus gates identity separately (Section 4). *Description for
the illustrator:* center, the asciichem-tests corpus and
asciichem-model schemas as two boxes joined by version tags; radiating
CI lanes to Ruby, TypeScript, Python, Rust; an arrow from the property
harness into the corpus labeled "seeded generation (300)"; a separate
oracle-corpus box feeding the identity gate.

## 4. Substance identity and citation

A molecule in a document is a substance with identity. The model
carries identifiers as first-class annotations (`@cas`, `@inchi`,
`@smiles`, `@iupac`). The resolver turns identifiers into substance
records with per-identifier provenance — which source asserted what,
and when it was retrieved — over pluggable sources: PubChem (default)
[9], an OPSIN name-to-structure adapter [10], and CAS Common Chemistry
(opt-in; its CC BY-NC license makes it a policy choice, not a default)
[11]. Resolver caches are reproducible artifacts, so a document's
identity claims can be rebuilt from the recorded responses.

The linter cross-validates annotations against the drawn structure:
format and consistency checks on every identifier, and a structural
identity cross-check that derives the InChI [12] for each annotated
molecule and compares it with the annotation, reporting a mismatch as
an error when an engine is available. Tetrahedral chirality crosses to
the identity layer as the MDL atom-parity field, so stereochemical
assertions are checked, not merely carried.

Local identity is never reimplemented per consumer. InChI and InChIKey
derivation goes through an opt-in engine interface with two engines:
the IUPAC reference binary (`inchi-1`, never vendored) [13], and a
native Rust engine, chemomer, which derives the full standard
identifier — canonical ranking, the mobile-H groups, the tetrahedral
and double-bond stereo layers, and the InChIKey — with no third-party
binary at runtime, exposed over a C ABI. Reactions receive the same
treatment through RInChI [14] over MDL RXN files.

The native engine is gated by a shared oracle corpus
(chemomer/inchi-tests): 5,627 structure fixtures recorded from the
IUPAC reference implementation [12,13], each carrying the oracle's
standard InChI and InChIKey. The gate compares every emitted segment
byte-for-byte, plus the native InChIKey against the recorded key, and
classifies every non-passing fixture in a dated triage ledger; at the
corpus revision pinned in the engine's CI, the ledger is empty.
Because the oracle records identifier strings rather than code, the
engine never ships or executes IUPAC software.

Citations are emitted as dataset-type bibliographic records — one per
(substance, source) the author chooses to cite — anchored by InChIKey
[15], which joins records across documents the way a DOI joins
literature. In Metanorma [16] documents, the
`metanorma-plugin-asciichem` plugin renders `[chem]` blocks as MathML
formula stems and collects the citation records into the References
section. A pilot document shipped with the plugin compiles an aspirin
synthesis end to end: typed condition roles on the reaction arrow, the
product as a structure with `@cite("pubchem")`, and the resolved
PubChem record appearing as a dataset bibitem anchored by InChIKey.

**Figure 3.** Identity-to-citation pipeline. *Caption:* authored
identifiers and drawn structures flow through the linter cross-checks;
opt-in engines derive InChI/InChIKey (IUPAC binary or the native
chemomer engine); the resolver attaches per-source provenance; each
(substance, source) pair the author cites is emitted as a dataset
bibitem joined by InChIKey. *Description for the illustrator:* left, a
`[chem]` block with annotations; center, three stages (linter
cross-check, engine derivation, resolver with source icons for
PubChem/OPSIN/Common Chemistry); right, the References section of a
Metanorma document showing one dataset bibitem with InChIKey and
retrieval provenance.

## 5. Results and discussion

**Conformance.** All four implementations pass the shared corpus's
acceptance/rejection contract in CI. Canonical-text round-trip is
green for Ruby, TypeScript, and Python across the static fixtures,
and the Rust implementation covers its declared model subset the same
way, reporting out-of-subset constructs as unsupported rather than
guessing. All four render the MathML goldens byte-identically, and the
Rust structural-SVG renderer is byte-exact with the TypeScript
renderer over a committed reference snapshot. The seeded differential
set (300 models) reaches model equality across Ruby, TypeScript, and
Python; the reference property spec re-run locally reproduces the
green state. Table 3 summarizes the level claims.

**Table 3.** Conformance level claims per implementation, as gated at
corpus v0.10.0. L3/L4 identity gates additionally use the InChI
oracle corpus (Section 4).

| Level | Ruby (reference) | TypeScript | Python | Rust |
|---|---|---|---|---|
| L0 notation | yes | yes | yes | yes; parse contract via PARG artifact |
| L1 semantics | yes | yes | yes | yes (declared model subset) |
| L2 render | yes | yes (text, structural SVG, MathML, wire) | yes (text, wire, MathML, SVG byte-exact with TS) | yes (MathML, canonical text, wire, SVG) |
| L3 stereo | yes | yes | yes | not claimed |
| L4 identity | yes | partial (InChI via engine) | not claimed | yes (native engine) |

**Perception.** Implicit-hydrogen counting and aromatic-ring
perception are shared, corpus-gated semantics, including the
deliberate declines. Aromatic bonds order as 1.5 for hydrogen
counting, so benzene ingested as `c1ccccc1` or as the Kekulé form
`C1=CC=CC=C1` perceives one hydrogen per carbon identically; quinone
rings are excluded from aromatic canonicalization because an in-ring
double bond is required. Where the derivation would have to guess —
charged atoms, aromatic-schematic fused atoms — the perception pass
returns no answer rather than an invented one, and the corpus pins
each decline as shared behavior rather than implementation variance.

**Stereo.** Chirality and directional bonds survive text, SMILES,
wire, and molfile round-trips; canonical SMILES emits parity-correct
tokens; the InChI stereo layers distinguish enantiomers (asserted
against the real engine, and covered by the oracle corpus's stereo
tranches for the native engine).

**Documents.** The Metanorma pilot compiles a standards-format
document in which `[chem]` blocks render as MathML stems, condition
roles are typed data, and the cited substance appears as a
dataset-type bibitem anchored by InChIKey — demonstrating the
authoring-to-citation path end to end without manual bibliographic
work.

## 6. Limitations

- The perception pass is deliberately conservative. Charged-atom
  hydrogen counting is deferred; five-membered aromatic rings are not
  perceived; aromatic-schematic fused atoms decline rather than guess.
  The corpus pins these as shared behavior so they cannot diverge
  silently between implementations.
- Directional (E/Z) bonds have no V2000 molfile representation without
  stereo-aware geometry; the loss is documented and asserted by the
  emitter rather than silent.
- The static fixture suites are small curated seed sets (Table 2);
  the breadth of the gate comes from the 300-case differential set and
  the 5,627-fixture InChI oracle corpus, both of which continue to
  grow. The reported counts are a floor, not a ceiling.
- Local identity requires an opt-in engine (the IUPAC binary [13] or
  the native chemomer engine). Neither is vendored; license review for
  distributing the IUPAC binary is a governance decision outside this
  paper's scope.
- CAS Common Chemistry [11] carries a non-commercial license (CC BY-NC
  4.0); source selection for resolution is a policy decision, and the
  architecture keeps sources pluggable with the default set to
  PubChem.
- L3 stereo is not yet claimed by the Rust implementation, and L4
  identity is claimed only partially by the TypeScript one; the gaps
  are visible in the conformance matrix rather than hidden.

## 7. Related work

AsciiMath [3] established plain-text math notation and the
parse-then-render pipeline. `mhchem` [1] and `chemfig` [2] established
chemist-facing LaTeX notation; both render well but, like AsciiMath,
carry typography rather than a queryable model. SMILES [4] and the
OpenSMILES specification [5] standardized structure interchange; the
MDL molfile formats [8] added depiction and stereo conventions; CML
[7] carried chemistry through XML. InChI and InChIKey [12,15] provided
the open identity layer, and OPSIN [10] closes the name-to-structure
direction. Plurimath [17] demonstrated the "single model, many
renderers" architecture for mathematical notation inside Metanorma
[16], whose bibitem machinery AsciiChem extends to substances.
AsciiChem's contribution is the combination: a structured-atom text
syntax with structural prefix binding, a contract-first
multi-implementation conformance model, and identity and citation as
part of the document layer.

## 8. Conclusions

AsciiChem shows that the distance between what a chemist types and a
machine-checkable model of chemistry is bridgeable without sacrificing
plain-keyboard authorship. The atom-binding decision makes isotopes
and charges properties of atoms rather than glyphs; the shared
contract makes four independent implementations answerable to one
corpus instead of four private test suites; and the identity layer
turns a drawn structure into a citable substance record whose
assertions carry provenance. The practical consequence for standards
work is that a document's chemistry becomes checkable: formulas
balance, identifiers match structures, and every cited substance
resolves to the record its author intended. The remaining work —
perception breadth, stereo in the newer implementations, and corpus
growth — is tracked publicly in the same conformance machinery the
ecosystem already gates on, so progress is measured in the same units
as the claims.

## Software availability

All software is open source. The implementations are distributed as
the `asciichem` Ruby gem, the `asciichem` npm package, the
`asciichem-py` Python package (PyPI), and the `asciichem-rs` Rust
crate (crates.io); all four are BSD 2-Clause licensed. The contract
repositories (`asciichem-model`, `asciichem-tests`) and the native
InChI engine (`chemomer`, with the `inchi-tests` oracle corpus) are
MIT licensed. The Metanorma plugin is `metanorma-plugin-asciichem`.
The specification site, including the live playground, is at
https://www.asciichem.org. The corpora are pinned by version tags and
vendored by consumers; the oracle corpus ships identifier strings
recorded from the IUPAC reference implementation and never IUPAC code.

## Acknowledgments

*Placeholder — the author list, funding, and acknowledgments are to be
finalized before submission.* The authors thank the maintainers of the
open standards and reference implementations on which this work
builds.

## Conflicts of interest

*Placeholder — confirm before submission.* The authors declare no
competing financial interest.

## References

(1) `mhchem` — Chemistry Formulae for LaTeX. CTAN.
https://ctan.org/pkg/mhchem

(2) `chemfig` — Drawing Molecules with LaTeX. CTAN.
https://ctan.org/pkg/chemfig

(3) AsciiMath. https://asciimath.org

(4) Weininger, D. SMILES, a Chemical Language and Information System.
1. Introduction to Methodology and Encoding Rules. *J. Chem. Inf.
Comput. Sci.* **1988**, *28* (1), 31–36. DOI:
[10.1021/ci00057a005](https://doi.org/10.1021/ci00057a005)

(5) OpenSMILES Specification. https://www.opensmiles.org (accessed
2026-11). *Re-verify the canonical URL at submission; the host was
unreachable at draft time.*

(6) Cohen, E. R.; Cvitaš, T.; Frey, J. G.; et al., Eds. *Quantities,
Units and Symbols in Physical Chemistry* (IUPAC Green Book), 3rd ed.;
RSC Publishing: Cambridge, 2007.

(7) Murray-Rust, P.; Rzepa, H. S. Chemical Markup, XML, and the
Worldwide Web. 1. Basic Principles. *J. Chem. Inf. Comput. Sci.*
**1999**, *39* (6), 928–942. DOI:
[10.1021/ci990052b](https://doi.org/10.1021/ci990052b)

(8) Dalby, A.; Nourse, J. G.; Hounshell, W. D.; Gushurst, A. K. I.;
Grier, L.; Leland, B. A.; Laufer, D. Description of Several Chemical
Structure File Formats Used by Computer Programs Developed at
Molecular Design Limited. *J. Chem. Inf. Comput. Sci.* **1992**, *32*
(3), 244–255. DOI:
[10.1021/ci00007a012](https://doi.org/10.1021/ci00007a012)

(9) Kim, S.; Chen, J.; Cheng, T.; Gindulyte, A.; He, J.; He, S.; Li,
Q.; Shoemaker, B. A.; Thiessen, P. A.; Yu, B.; et al. PubChem 2023
Update. *Nucleic Acids Res.* **2023**, *51* (D1), D1373–D1380. DOI:
[10.1093/nar/gkac956](https://doi.org/10.1093/nar/gkac956)

(10) Lowe, D. M.; Corbett, P. T.; Murray-Rust, P.; Glen, R. C.
Chemical Name to Structure: OPSIN, an Open Source Solution. *J. Chem.
Inf. Model.* **2011**, *51* (3), 739–753. DOI:
[10.1021/ci100384d](https://doi.org/10.1021/ci100384d)

(11) CAS Common Chemistry. https://commonchemistry.cas.org

(12) Heller, S. R.; McNaught, A.; Pletnev, I.; Stein, S.;
Tchekhovskoi, D. InChI, the IUPAC International Chemical Identifier.
*J. Cheminform.* **2015**, *7*, 23. DOI:
[10.1186/s13321-015-0068-4](https://doi.org/10.1186/s13321-015-0068-4)

(13) IUPAC InChI Software (version 1.07 series). InChI Trust.
https://www.inchi-trust.org

(14) RInChI — Reaction InChI. https://github.com/IUPAC-InChI/RInChI

(15) Pletnev, I.; Erin, A.; McNaught, A.; Blinov, K.; Tchekhovskoi,
D.; Heller, S. InChIKey Collision Resistance: An Experimental Testing.
*J. Cheminform.* **2012**, *4*, 39. DOI:
[10.1186/1758-2946-4-39](https://doi.org/10.1186/1758-2946-4-39)

(16) Metanorma. https://www.metanorma.org

(17) Plurimath. https://github.com/plurimath/plurimath
