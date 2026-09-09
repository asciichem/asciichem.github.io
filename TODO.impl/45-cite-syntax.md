# 45 — Cite-by-substance syntax + CML mapping

- **Priority:** P2
- **Status:** pending
- **Depends on:** 44
- **Implements:** TODO.v2 08 §2

## Motivation

The user must state *where* they cite a substance from, in the
AsciiChem source itself, and it must survive round-trips.

## Scope

- Molecule annotation binding citation to source: `source:id` form,
  e.g. `@cite("commonchemistry:50-78-2")`, `@cite("pubchem:2244")`.
  Exact spelling is an implementation design decision (documented in
  the PR) — grammar rule + transform + Text canonicalisation.
- CML mapping via the existing `aci:`/metadata extension channels —
  no new wire invention.
- Optional sourceless `@cite` = manual/unverified mode: minimal
  bibitem (CAS RN + accessed date), flagged unverified; docs steer to
  source-bound citations.
- Round-trip specs (Text + three-way CML) added to the corpus.

## Acceptance

- Syntax round-trips; corpus cases added; spec-site annotation docs
  updated (paired PR).
