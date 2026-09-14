# 62 — MathML relies on the mml contract model

- **Priority:** P2
- **Status:** done (2026-09-14) — maintainer direction
- **Implements:** ecosystem alignment with plurimath/mml

## Motivation

The mml gem (plurimath/mml) is the typed lutaml-model object graph
for MathML 2/3/4 — the ecosystem's MathML contract model. AsciiChem
used it only transitively (via plurimath) and never directly:
emission hand-built Nokogiri elements, and embedded-math grafting did
xpath surgery on a Plurimath string.

## Division of labour (verified against plurimath's own source)

- **Emission**: XML-builder based (Nokogiri here, ox_element in
  Plurimath's `Formula#to_mathml`). Neither ecosystem hand-builds
  MathML through the mml class hierarchy — mml's per-type child
  collections cannot express interleaved element order positionally,
  so builder emission is the ecosystem pattern, kept as-is.
- **Parsing/validation**: the mml gem. This is where AsciiChem now
  relies on it directly.

## Shipped

- `mml (~> 2.3)` promoted to a direct dependency (was transitive
  via plurimath; no resolution change).
- `visit_embedded_math`: Plurimath string → `Mml.parse(version: 3)`
  typed graph → framework `to_xml` per top-level child → graft.
  No more xpath; the fragment's indentation now normalises into the
  document shape. Corpus goldens unaffected (embedded math is not
  golden-pinned; TS/py degrade it to `<mtext>` — TODO 61 gap note).
- New spec contract (`mathml_mml_spec.rb`): every emitted MathML
  and every shared-corpus golden parses back through `Mml.parse` —
  validity per the typed model, not just well-formed XML.

## Acceptance

- Full suite green (1970 examples) with 27 new mml-reliance specs;
  all 21 `format/mathml/*` goldens proven valid under `Mml.parse`.
