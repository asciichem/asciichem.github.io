# 44 — Citation builder + source profiles + cite CLI

- **Priority:** P2
- **Status:** pending
- **Depends on:** 38–40 (resolver adapters carry the profiles)
- **Implements:** TODO.v2 08 §1

## Motivation

Bibitem = f(substance, source): the same structure cited from Common
Chemistry vs PubChem yields different bibitems. The builder is
generic; each resolver adapter ships a citation profile; new source =
new profile registration, zero builder edits (OCP/MECE).

## Scope

- `AsciiChem::Citation` generic builder: (SubstanceRecord, profile) →
  Relaton-compatible BibliographicItem description (typed data; Relaton
  object construction stays in the metanorma-side gem — core stays
  I/O-free). Type `dataset`; publisher/title/version+accessed/links/
  identifiers (CAS RN, InChIKey); pre-formatted citation string when
  the source provides one (Common Chemistry does).
- Profiles live with adapters (39/40/NCI CIR): a source that cannot be
  resolved cannot be cited — one registration point.
- Dedupe: one bibitem per (source, substance); InChIKey is the join
  anchor across sources.
- `asciichem cite commonchemistry:50-78-2 [--format relaton-xml|yaml|text]`
  — same code path as the document pipeline.

## Acceptance

- Aspirin from two sources → two distinct correct bibitems; twice from
  one source → one deduped entry.
- Synthetic-source registration spec proves no builder edits needed.
- CLI output equals pipeline output (spec asserts equality).
