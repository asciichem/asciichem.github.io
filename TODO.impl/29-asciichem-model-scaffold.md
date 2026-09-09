# 29 — `asciichem-model` repo scaffold

- **Priority:** P1
- **Status:** in-progress — scaffold **done** 2026-09-09 at
  `~/src/asciichem/asciichem-model` (README, gemspec, seed schemas
  atom/molecule/identifier + lutaml defs + examples, schema self-check
  specs green, ADR-0001); remaining: git init + branch/PR workflow.
- **Depends on:** nothing
- **Implements:** TODO.v2 01

## Motivation

The semantic model must be defined once, language-neutrally, before TS
or PY implementations start. The glossarist ecosystem solved this
exact problem with `concept-model`; we follow that pattern.

## Scope

- New repo at workspace root (`~/src/asciichem/asciichem-model`), gem
  `asciichem-model`.
- Layout (per `~/src/glossarist/concept-model`): `models/asciichem/*.lutaml`
  (normative definitions), `schemas/v1/*.yaml` (JSON Schema 2020-12 in
  YAML, repo-pinned `$id`), `schemas/v1/examples/*.yaml` (numbered,
  positive + negative), `lib/asciichem/model/…` (validator suite + type
  generator), `spec/`, Gemfile/Rakefile/gemspec, README with the SemVer
  discipline table (MAJOR: removed/renamed shape/class/property/enum;
  MINOR: additive; PATCH: fix/docs).
- Consumer protocol documented: Ruby depends on the gem; TS vendors
  via `sync-asciichem-model` script pinned to tags; PY uses generated
  dataclasses/schemas.
- git init + first PR workflow (branch, PR — never commit to main
  directly).

## Acceptance

- Repo scaffolded, README documents the pattern and versioning rules.
- CI placeholder (rspec) green.
