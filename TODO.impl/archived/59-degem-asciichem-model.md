# 59 — De-gem asciichem-model: contract repo, not a rubygem

- **Priority:** P1 (maintainer decision 2026-09-12)
- **Status:** done — asciichem-model#12, gem #57
- **Repos:** asciichem-model, asciichem-ruby, asciichem.github.io

## Problem

asciichem-model ships to RubyGems, but its only consumer is
asciichem-ruby's conformance suite (schema validation of wire
emission). The Ruby runtime model already lives in the asciichem gem
(`AsciiChem::Model::*`); the lutaml definitions, schemas, and
generated types are implementation-independent contract content that
belongs to the website and the implementations' vendored copies —
the glossarist reference structure: glossarist-ruby is self-contained
(no concept-model dependency); concept-model's gem packaging serves
data-pipeline validators that asciichem does not have.

## Change

- asciichem-model becomes a pure **contract repo**: models
  (.lutaml), schemas + examples + generated types, the type
  generator and example validator as maintainer scripts (minimal
  Gemfile, no gemspec, no publishing, no release workflow).
- asciichem-ruby validates its own emission the way asciichem-ts
  already does: **vendored schemas** (scripts/update-model-schemas.sh,
  pinned to a model tag) + json_schemer as a dev dependency; the
  asciichem-model gem dependency is removed. A spec helper ports the
  memoized loader with relative-ref rewriting.
- Site /models page and workspace CLAUDE.md describe the new
  consumption model.

## RubyGems

Published asciichem-model versions (0.1.0–0.3.4) remain valid
artifacts of the old shape; 0.4.0 never published (trusted publisher
was never registered). Marking the gem deprecated on rubygems.org is
an owner action — maintainer's call.
