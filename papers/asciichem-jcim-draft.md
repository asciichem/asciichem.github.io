# Chemistry as a first-class citizen of plain-text standards documents

*A draft paper (JCIM-style) describing AsciiChem. Status: working draft,
not submitted. Numbers below are drawn from the project's conformance
suite and shared corpus as of the 2026-10 releases.*

## Abstract

Chemistry appears in standards, regulations, and scientific documents
as typography: subscripts, superscripts, arrows, and bracketed
conditions. Typography carries no machine-checkable semantics, so a
document's chemistry cannot be validated, cross-referenced, or cited as
a substance. We present AsciiChem, a plain-keyboard syntax whose parse
is a semantic model of chemistry rather than a rendering of glyphs.
Three properties distinguish the approach. First, prefixes bind to
atoms structurally: `^14C` parses as a carbon atom carrying isotope 14,
never as a superscript on a phantom carrier — the failure mode
inherited from AsciiMath and mhchem-style typography. Second, the
semantic model is a *shared contract*: versioned wire schemas and a
conformance corpus are the normative artifact, and independent
implementations (Ruby, TypeScript, Python, Rust) are gated by the same
fixtures, with seeded differential generation making the gate
adversarial rather than illustrative. Third, identity is part of the
document layer: structures resolve to authoritative records (PubChem,
OPSIN, local InChI), cross-validate against authored identifiers, and
emit citation-grade bibitems — one per (substance, source) — anchored
by InChIKey. We report corpus-verified conformance levels per
implementation and a Metanorma/ISO pilot document in which reactions,
conditions, and cited substances compile into a standards-format
document.

## 1. Introduction

Standards documents name substances normatively. A method clause that
says "dissolve the residue in ethanol" is a claim about a specific
chemical; the ability to check that claim — is the formula right, is
the structure the substance the identifier names, is the cited record
the one asserted — is currently manual. The tooling gap is not
rendering: LaTeX packages (mhchem, chemfig) and word processors render
chemistry well. The gap is that the authored text has no semantic
model behind the rendering, so nothing downstream can query it.

AsciiMath solved the analogous problem for mathematics by defining a
plain-text syntax that renders reliably. Chemistry breaks AsciiMath's
assumptions in three places: prefixes (isotopes, charges, substates)
must bind to atoms; reactions carry arrows, stoichiometry, and
conditions; structures carry bonds and stereochemistry. Treating
chemistry as typography forces authors into carrier hacks — the
canonical example being `{}^14C`, a superscript over an empty
group — that no parser can interpret.

AsciiChem's design claim is that a compact ASCII syntax can parse
directly into a semantic model, and that the model can be shared as a
contract across implementations and documents. This paper describes
the design, the contract, and the conformance evidence.

## 2. The atom-binding fix

The syntax is deliberately close to what chemists type and to
established conventions (`mhchem`, SMILES-style ring closures). The
defining structural decision is that prefixes are parsed as part of
the atom token:

```
^14C          -> Atom(element: "C", isotope: "14")
Ca^2+         -> Atom(element: "Ca", charge: "2+")
_6Li          -> Atom(element: "Li", subscript: "6")
```

A bare `^14` with no following element is a parse error, not a
floating superscript. The same structural discipline is applied to
molecules, groups, bonds, reactions, and mechanism bodies: the grammar
captures semantic units, and the transform builds typed nodes, never a
typographic tree. Round-tripping is the contract —
`parse(text).to_text == text` for canonical input — so the model is
lossless with respect to the authored form.

Reactions gain typed data the typographic approach cannot express:
stoichiometric coefficients are model fields; condition brackets keep
their text verbatim while deriving typed role entries
(`[cat: Pd; solv: THF]` → catalyst/solvent entries with free-text
fallback); `Reaction#stoichiometry` exposes normalized per-side
coefficient maps feeding a balance check. Mechanisms keep their steps
verbatim and derive a step graph — parsed step reactions, catalysts
(species on both sides), inter-step links, and electron-flow markers.

## 3. The shared contract

The normative artifact is not an implementation. Two contract
repositories define the language:

- **asciichem-model** — versioned JSON Schemas for the wire form, with
  LUTAML definitions and generated TypeScript types. Additions follow a
  documented additive rule; consumers vendor from tags.
- **asciichem-tests** — the conformance corpus: parser
  acceptance/rejection, canonical-text round-trip, MathML goldens, CML
  three-way round-trip, linter expectations, SMILES/molfile
  interchange, perception semantics, and seeded generated models
  (wire JSON + canonical text) shared by every implementation.

Four implementations are gated by the same corpus: Ruby (the
reference), TypeScript, Python, and Rust. The Rust implementation does
not reimplement the grammar: it consumes the compiled PARG artifact of
the syntax — a checksummed JSON envelope verified at load by the
parsanol engine — and passes the corpus's acceptance/rejection
contract. Implementations claim conformance *levels* (L0 notation, L1
semantics, L2 render, L3 stereo, L4 identity); a claim without the
green corpus run behind it does not ship.

Differential generation closes the "explains its own fixtures" gap:
from a seeded generator, valid models are produced, rendered to
canonical text, re-parsed, and compared across implementations. Every
failure becomes a corpus fixture. The generated set currently comprises
300 models; all three dynamic implementations reach model equality on
the full set.

The corpus discipline has a corollary worth stating: fixtures are never
edited to make an implementation pass. Contract changes (for example
canonical aromatic SMILES, where Kekulé input now canonicalizes to the
lowercase form) ship as explicit versioned changes with stated new
expectations, not as silent edits.

## 4. Identity and citation

A molecule in a document is a substance with identity. The model
carries identifiers as first-class annotations (`@cas`, `@inchi`,
`@smiles`, `@iupac`); the resolver turns identifiers into substance
records with per-identifier provenance (which source asserted what,
retrieved when); the linter cross-validates annotations against the
drawn structure, including stereo layers (tetrahedral chirality
crosses to the InChI engine as MDL atom parity). Local identity is
never reimplemented: InChI/InChIKey derivation wraps the IUPAC binary
behind an opt-in engine, and reactions get the same treatment through
RInChI over MDL RXN files.

Citations are emitted as dataset-type bibliographic records — one per
(substance, source) the author chooses to cite — anchored by InChIKey,
which serves as the join key across documents the way a DOI serves
literature. In Metanorma documents the plugin renders `[chem]` blocks
as MathML formulas and collects the bibitems into the References
section. The pilot document in this repository's companion artifact
compiles such a document end to end, including typed condition roles
and a PubChem-anchored dataset record.

## 5. Results

- Corpus acceptance/rejection: four implementations green (Ruby,
  TypeScript, Python, Rust).
- Canonical-text round-trip: Ruby, TypeScript, Python green per
  fixture; Rust covers acceptance/rejection at this stage.
- Differential conformance: 300 seeded generated models, model
  equality across Ruby/TypeScript/Python.
- Perception: implicit hydrogens and aromatic-ring semantics are
  shared, corpus-gated semantics — including the deliberate *declines*
  (charged atoms, aromatic-schematic fusion atoms) that keep the pass
  from inventing chemistry. Aromatic bonds order 1.5 for H-counting, so
  `c1ccccc1` and `C1=CC=CC=C1` perceive identically; quinone rings are
  excluded from aromatic canonicalization by an in-ring double-bond
  requirement.
- Stereo: chirality and directional bonds survive text, SMILES, wire,
  and molfile round-trips; canonical SMILES emits parity-correct
  tokens; enantiomers derive distinct InChIs.
- Documents: a standards-format pilot compiles chemistry as MathML
  stems and a cited substance as a dataset bibitem.

## 6. Limitations

- Perception is deliberately conservative. Charged-atom hydrogen
  counting is deferred; five-membered aromatic perception is not
  implemented; aromatic-schematic fused atoms decline rather than
  guess. The corpus pins these as shared behavior rather than
  implementation variance.
- Directional (E/Z) bonds have no V2000 representation without
  stereo-aware geometry; the loss is documented and asserted, not
  silent.
- Local identity requires the external InChI/RInChI binaries (opt-in,
  never vendored). Licence review for vendoring is a governance
  decision outside this paper's scope.
- CAS Common Chemistry is a powerful source but carries a
  non-commercial licence; source selection is a policy decision, and
  the architecture keeps sources pluggable.

## 7. Related work

AsciiMath established plain-text math syntax and the rendering
pipeline; mhchem and chemfig established chemist-facing LaTeX notation;
SMILES, InChI, and CML standardised structure interchange and identity.
Plurimath demonstrated the "single model, many renderers" architecture
for math. AsciiChem's contribution is the combination: a
structured-atom text syntax, a contract-first multi-implementation
conformance model, and identity/citation as part of the document
layer.

## 8. Availability

Source, schemas, corpus, and the specification site are public under
the asciichem organisation. Implementations: `asciichem` (Ruby gem),
`asciichem` (npm), `asciichem-py`, `asciichem-rs` (parse contract).
The corpus and schemas are implementation-independent repositories.

## Acknowledgements

This draft describes work across the AsciiChem ecosystem; the
maintainers of the referenced standards and reference software (IUPAC
InChI Trust, OpenSMILES, Metanorma, Plurimath) made the underlying
formats usable.
