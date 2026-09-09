# 37 — Gem intake of model + corpus

- **Priority:** P1
- **Status:** pending
- **Depends on:** 30, 31, 33, 34
- **Implements:** TODO.v2 03

## Motivation

Once the model repo is normative and the corpus executable, the gem
becomes a consumer of both — making the Ruby API one implementation
among several without breaking its public API.

## Scope

- Gemspec: `asciichem-model` runtime dep; `asciichem-tests` dev dep.
- Canonical-JSON (de)serialisation via `lutaml-model` `attribute` +
  `mapping` blocks against the wire form — zero hand-rolled key
  manipulation (global rule).
- `spec/conformance/` runs the shared corpus (L0–L4) in CI; existing
  RSpec suite stays as the fast layer.
- `Model::Identifier` upgraded to the identity model (convention
  registry wired to `AsciiChem::Identifiers`); `SubstanceRecord` value
  object for resolvers.
- Public API unchanged (`AsciiChem.parse`, `#to_<format>`, `Cml`,
  linter registry, CLI).

## Acceptance

- Full suite green incl. corpus runner at 100% L0–L4.
- `parse(s).to_model_json` round-trips for every `roundTrip: true`
  corpus case.
- Gem behaviour visibly unchanged (site examples identical).
