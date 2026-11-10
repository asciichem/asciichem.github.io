# 41 — CLI resolve/validate

- **Priority:** P2
- **Status:** done — gem#59 (validate + resolve; 40 blocked on CC sign-off)
- **Depends on:** 35 (validate), 38–40 (resolve)
- **Implements:** TODO.v2 07 Layer 3

## Motivation

The resolver and validators need user-facing entry points: validation
is offline and always available; resolution is opt-in with source
selection and cache controls.

## Scope

- `asciichem validate -i 'C @cas("50782")'` — runs identifier checks,
  prints diagnostics.
- `asciichem resolve [--source NAME] [--refresh] (--cas 50-78-2 |
  --name aspirin | --inchikey …) [--format text|json|cml]` — resolves,
  prints substance record, suggests annotations with provenance.
- Error paths: unknown source, missing credentials (NC sources),
  cache-miss offline — actionable messages.

## Acceptance

- Both subcommands spec'd (CLI specs use recorded responses; no
  network in CI).
