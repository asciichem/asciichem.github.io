# 66 — Native InChI engine (three-repo program)

- **Priority:** P2
- **Status:** in-progress — M0 and M1 green in both engines; M2 slice 1
  (rules decoded) landed 2026-10-22. Architecture and hardening merged
  in inchi-rs#3.
- **Repos:** `asciichem/inchi-engine` (exploration), `asciichem/inchi-tests`
  (contract), `asciichem/inchi-rs` (production)
- **Supersedes:** the vendoring follow-up in TODO 48 — the maintainer
  directed a native implementation across runtimes (2026-10-21):
  no compiled third-party code at runtime, no vendoring, no fork.
- **Depends on:** 48 (binary adapter, shipped), 43 (molfile emission)

## Motivation

InChI identity must be computable in every AsciiChem runtime without
compiling or shipping the IUPAC C implementation. The derivation is a
graph-canonicalization problem (canonical numbering, then layer
serialization), not a parsing problem: PARG remains the grammar
contract for AsciiChem syntax only.

The IUPAC `inchi-1` binary (MIT) is a development-time **test oracle**
only. The corpus ships recorded strings; no engine executes or bundles
the oracle at runtime.

## Three-repo contract

| Repo | Role |
|---|---|
| `inchi-tests` | The oracle corpus: identity seeds, 1500-fixture breadth, triage file, suite contract (SUITE.md). Tagged `v0.1.0`; every engine pins the tag in CI. |
| `inchi-rs` | Production engine. Layer-registry architecture (OCP): one module per layer, `LayerEmitter` trait, kind-matched gate. |
| `inchi-engine` | Exploration playground where the ruleset is decoded from the corpus (formula rules, `/c` grammar, replay census). Not a shipping artifact. |

Invariants:

- Fixtures are never edited to make an engine pass. A disagreement is
  either an engine bug or a triage entry with a decoded reason.
- Every engine runs the *same* kind-matched gate: emitted segments are
  compared to the oracle recording for that layer kind, because
  milestone-partial engines emit a subset and InChI orders layers
  itself.
- A partial layer set must never assemble an identifier:
  `Engine::inchi_string` refuses until formula + connection are
  registered.

## Milestones

| # | Scope | Status |
|---|---|---|
| M0 | Repos, V2000 reader, gate, corpus `v0.1.0` | done |
| M1 | Formula layer (Hill/InChI order, implicit H, ±1 `/p`) | done — 1529 fixtures gated |
| M2 | Canonical ranking + `/c` connection layer | slice 1 done (grammar decoded); slice 2 next |
| M3 | Mobile-H (`/h`) — 219 m3-tagged fixtures + 11 triaged | pending |
| M4 | Stereo (`/t`, `/b`, `/m`, `/s`) | pending |
| M5 | InChIKey (SHA-256 base-26 encoding over the canonical string) | pending |
| M6 | Bindings: PyO3, napi/wasm, Ruby native or C-ABI | pending |
| M7 | AsciiChem/Metanorma integration; identity claims | pending |

## M2 slice 2 — the next unit of work

Decoded and proven in `inchi-engine` (see `EXPERIMENTS.md`):

- The `/c` grammar: numbers bond to the current walk atom; a fresh
  number advances the walk; a seen number closes a ring; parentheses
  push/restore branch points; ranks are a permutation of `1..n`.
- Replay census: 93/93 recorded `/c` segments are valid emissions of
  the writer’s molfile graph; 79/93 are symmetric-ambiguous. The
  remaining problem is therefore the **emission-choice rule**, not
  connectivity.

Work:

1. Port the ranking experiment to `inchi-rs` as a `canonical` module:
   invariants (degree, element, charge, H count), iterative refinement,
   tie-break by canonical rank order. Test against the oracle rank
   order recorded per fixture.
2. Test the minimal-emission hypothesis (lexicographically minimal
   valid emission, canonical walk start = rank 1) against the full
   93-fixture census before implementing.
3. Implement the connection emitter, register
   `(order::CONNECTION, segment_kind Some('c'))`, extend the gate.

## Testing framework (current)

- 18 Rust unit tests (reader columns and codes, graph valence/H
  semantics incl. aromatic 1.5, layer rules, assembler completeness and
  ordering) plus the single corpus gate test.
- Gate tallies pass / M3 skips / beyond-±1 skips and fails on any
  violation; triage ids are counted separately.
- CI: pinned `inchi-tests v0.1.0`, `cargo fmt --check`,
  `clippy -D warnings`, `cargo test --locked`, cached build.
- Exploration side: `gate.rb` plus replay census scripts.

## Opportunities (not yet scheduled)

- Property tests (proptest) over the `/c` replayer: every emitted
  string re-parses to the same graph.
- `criterion` benchmarks for derivation throughput once M2 lands;
  regression budget in CI like the Ruby benchmarks.
- Coverage (`cargo-llvm-cov`) with a floor on the layer modules.
- `cargo-deny` audit (currently no runtime dependencies, so revisit
  when bindings arrive).
- Oracle-regeneration job: documented, manual, dev-time (requires the
  IUPAC binary); never runs in the engine CI.
- Publish the corpus as a citable dataset (Zenodo DOI) with the tag.
- WASM build for the site playground once M5 exists, so the site can
  showcase native identity client-side.

## Acceptance

- M2: rank order matches the oracle for every M2-eligible fixture;
  connection segments match byte-for-byte; gate green; no fixture
  edited.
- Program: an InChIKey computed natively by every runtime implementation
  matches the oracle recording for the full corpus, with the oracle
  absent from the runtime dependency graph.
