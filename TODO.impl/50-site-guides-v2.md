# 50 — Spec-site v2 content

- **Priority:** P3 (guide for 07 is P2 timing-wise; batched here)
- **Status:** done — structures-and-resolution guide landed; further guides append as tracks ship
- **Depends on:** 35 (validate), 38–41 (resolve), 44–45 (cite)
- **Implements:** TODO.v2 07 §Layer 3 + 08 §4

## Motivation

v2 features need user-facing documentation on the spec site, with
licenses stated clearly and workflows demonstrated end-to-end.

## Scope

- "Substance lookup" guide: annotation syntax, resolver usage,
  sources-and-licenses table (CC BY-NC 4.0 prominent), caching and
  attribution behaviour.
- "Citing substances in Metanorma" guide: the workflow (parse →
  validate → resolve → cite), same-structure-different-bibitems story,
  bibitem examples, InChIKey anchoring.
- Implementation-status table rendering `conformance.json` from each
  API's CI (single-contract rule made visible).
- Update `annotations.mdx`, `api.mdx`, `cml.mdx` for new syntax
  (`@cite`).

## Acceptance

- Pages built, link-checked, a11y-checked; examples render via the
  build-time gem path; paired PRs where gem + site ship together.
