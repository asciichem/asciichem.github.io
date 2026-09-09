# 32 — Model type generator + validator suite

- **Priority:** P1
- **Status:** **done** (2026-09-09 — asciichem-model#2: Validators (json_schemer, positive+negative examples in CI) and SchemaTypeGenerator + exe + rake drift check; tagged v0.2.0)
- **Depends on:** 29, 30
- **Implements:** TODO.v2 01 (generator + validators)

## Motivation

TS/JS consumers need typed access without a second hand-written model;
the model repo needs self-checks so schema drift is caught at the
definition, not in three implementations. Glossarist's
`SchemaTypeGenerator` (schemas → TS types, CI drift detection) is the
template.

## Scope

- `SchemaTypeGenerator` — emits TypeScript interfaces/type aliases
  from `schemas/v1/*.yaml`; `check_mode` fails CI on drift
  (`exe/generate-types-from-schemas` CLI entry).
- Validator suite (self-checks, concept-model style): enum drift
  between schemas and lutaml definitions; schema `$ref` integrity;
  positive examples pass / negative examples fail; every node type
  has ≥ 1 positive and ≥ 1 negative example.
- Document the consumer protocol: gem dep (Ruby), vendored sync
  script pinned to tags (TS), generated dataclasses (PY).

## Acceptance

- `rake generate:types` + `rake generate:types:check` wired into CI.
- All validators green; coverage report lists per-node example counts.
