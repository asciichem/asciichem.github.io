# 40 — Common Chemistry resolver adapter

- **Priority:** P2
- **Status:** pending
- **Depends on:** 38; **blocked on maintainer license sign-off**
  (TODO.v2 07 "License decision")
- **Implements:** TODO.v2 07 Layer 2

## Motivation

CAS Common Chemistry is the authoritative source of validated CAS RNs
and ships pre-formatted citations — but CC BY-NC 4.0 and API
registration make it an explicit opt-in, never a default.

## Scope

- `Resolver::CommonChemistry`: search/detail/export endpoints
  (`api.commonchemistry.cas.org/api/`), registration-gated credentials,
  ~1 req/s throttling, deleted/replaced CAS RN handling.
- Every cached record carries CAS attribution; adapter documents NC
  terms; opt-in config only.
- Citation profile for 08: CAS publisher, accessed-date versioning,
  detail-page links, pre-formatted citation string.
- Recorded fixture responses (from the paper's documented payload
  shape) for offline specs.

## Acceptance

- Aspirin detail fixture (identifiers, synonyms, properties,
  pre-formatted citation) resolves offline; attribution present in
  every cache entry; default-off behaviour spec'd.
