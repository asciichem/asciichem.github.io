# 36 — ADR-0001: language-binding strategy

- **Priority:** P1
- **Status:** **done** (2026-09-09 — `asciichem-model/docs/adr/0001-language-bindings.adoc`)
- **Depends on:** nothing (decision record)
- **Implements:** TODO.v2 04

## Motivation

TS and PY APIs can be per-language implementations against the shared
model + corpus (strategy A, CommonMark-style) or thin bindings over a
Rust core (strategy B, tiktoken-style). Wrapping the Ruby gem is a
non-option. The decision must be recorded with rationale and revisit
triggers, not left implicit.

## Scope

- `asciichem-model/docs/adr/0001-language-bindings.adoc`:
  recommendation **A now** (per-language TS/PY conforming to
  asciichem-model + asciichem-tests), **B deferred** with triggers:
  (a) performance becomes a requirement, (b) ≥ 3 implementations and
  drift cost exceeds one Rust rewrite + bindings, (c) client-side WASM
  needs exceed the TS API.
- Conformance claim process: implementations state corpus levels
  (L0–L4) verified in CI via `conformance.json`.

## Acceptance

- ADR merged with analysis table, recommendation, triggers.
- 46/47 (TS/PY) unblocked per strategy A.
