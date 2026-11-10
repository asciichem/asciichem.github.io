# Papers

Working papers about the AsciiChem ecosystem. Drafts, not submissions.

## Submission checklist (maintainer actions before submission)

Submission itself is the maintainer's decision; this checklist covers
what must be true before it happens.

- [ ] **Venue and article type.** Confirm the target (draft is written
  to JCIM, ACS *J. Chem. Inf. Model.*) and re-read the current ACS
  author guidelines: article length, figure limits, TOC/synopsis
  graphic requirement (JCIM requires one), and abstract word cap
  (≤ 250 words; the current abstract is 219).
- [ ] **Authors.** Confirm the author list, affiliations, corresponding
  author, funding statement, and ORCID iDs for all authors. Fill the
  Acknowledgments and Conflicts-of-interest placeholders in the draft.
- [ ] **Re-verify numbers at submission time.** Tables 2 and 3 and the
  oracle-corpus count (5,627 identity fixtures) reflect corpus v0.10.0
  and the November 2026 implementation state; if versions moved, update
  the tables and the abstract. Counting commands: fixture counts from
  `asciichem-tests/corpus/fixtures/*.json`; identity corpus from
  `chemomer/inchi-tests/corpus/fixtures/identity*.json`; level claims
  from the site's conformance matrix page.
- [ ] **Figures.** Figures 1–3 are captioned textual descriptions only;
  draw them (vector formats per ACS) and keep captions consistent with
  the artwork.
- [ ] **References.** Journal citations have Crossref-verified DOIs.
  Reference (2) (OpenSMILES) carries a note: its host was unreachable
  at draft time — confirm the canonical URL. Convert bracketed numeric
  citations to ACS superscript style on import; check names, year
  (PubChem entry is the 2023 update, NAR 51(D1)), and volume/issue
  formatting in ACS Paragon.
- [ ] **Format pass.** Bracketed `[n]` citations, Markdown tables, and
  code blocks must be converted to the journal template (Word/LaTeX).
  InChI/InChIKey capitalization follows IUPAC convention — keep it.
- [ ] **Associated Content / Supporting Information.** Decide whether
  to ship the Metanorma pilot document, corpus excerpts, or the
  differential-generation harness as SI, and reference them.
- [ ] **Trademark/licence notes.** The paper states the InChI oracle
  corpus ships recorded identifier strings, never IUPAC code; confirm
  this wording satisfies InChI Trust usage guidance, and that the
  licence statements (BSD-2 implementations, MIT contract repos) match
  the repos at submission time.
- [ ] **Final voice pass.** No marketing language, consistent "InChI"
  capitalization, American spelling; check the draft's status line at
  the top is removed before submission.

Drafts:

- [asciichem-jcim-draft.md](asciichem-jcim-draft.md) — the JCIM-style
  paper: the atom-binding fix, the single-contract multi-implementation
  conformance model, and substance-citation provenance.
