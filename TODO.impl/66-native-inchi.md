# 66 — Native InChI engine (three-repo program)

- **Priority:** P2
- **Status:** in-progress — M0-M2 green; M3 slice 2 landed
  (2026-10-23): mobile-H groups gate live at corpus pin v0.1.3
  (carboxyl, amide, urea, amidine patterns byte-exact); the
  tautomer-parity residue (98 fixtures) is triaged with dated reasons
  and the ichitaut template port is the retiring slice.
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
| M2 | Canonical ranking + `/c` connection layer | done (2026-10-22, inchi-rs#5) — native canonicalization, corpus green at v0.1.1 |
| M3 | Mobile-H (`/h`) — m3-tagged fixtures, parenthesized-`/h` fixtures, and triaged ids | slices 1-2 done (fixed-H + mobile groups live); ichitaut-parity residue triaged; S/P valence pending |
| M4 | Stereo (`/t`, `/b`, `/m`, `/s`) | pending |
| M5 | InChIKey (SHA-256 base-26 encoding over the canonical string) | pending |
| M6 | Bindings: PyO3, napi/wasm, Ruby native or C-ABI | pending |
| M7 | AsciiChem/Metanorma integration; identity claims | pending |

## M2 — outcome (2026-10-22)

The base canonicalization path is ported natively (inchi-rs#5):
invariants (element order, heavy-atom degree — deliberately
hydrogen-free), position-based partitions with equitable refinement
and individualization, a two-pass search keeping the greatest
connection table, and the table's DFS emission (`GetDfsOrder4CT`
shape) into the `/c` segment with `(x,y)z` branch delimiters.
Hydrogen counts play no role in the `/c` numbering; the alkyne-vs-N
fixtures proved that empirically. The corpus gate is green at
corpus v0.1.1 with:

- every un-triaged, non-mobile-H fixture's `/c` matching byte-for-byte
  except **breadth-448**, a two-bridge symmetric system triaged with
  the decoded reason (reachable-set ordering differs; revisit with the
  reference's automorphism-orbit pruning, `CanonGraph` L10-L13);
- isotopic fixtures (an `/i` layer, e.g. d2o) counted as isotopic
  skips — isotopes are their own milestone.

## M3 — remaining work (slice 2)

Slice 1 (done, inchi-rs#6): the fixed-H `/h` layer — counts ascending,
ranks ascending within a count, consecutive runs as ranges; counts are
the ±1-standardized ones via `standardization::adjusted_hydrogens`
(one home, shared with the formula total). Slice 1 also settled an
open canonicalization question: where connectivity cannot choose
between automorphic labelings, hydrogen counts do — the search now
applies a corpus-derived minimum-hydrogen preference at table-equal
terminals. Eight orbit representatives still choose differently
(triaged in corpus v0.1.2; revisit with the reference's
automorphism-orbit pruning, `CanonGraph` L10-L13).

Slice 3 — outcome (2026-10-23, inchi-rs#9): the m3 slice gates.
The implicit-hydrogen model is the allowed-valence rule (smallest
allowed valence absorbing the bond-order sum; S {2,4,6}, P {3,5});
hypervalent oxo chemistry stops inventing hydrogens. The gate drops
its m3 and S/P skips: with corpus v0.1.5 the whole 1529-fixture
suite gates green (pass 1332; skips = 180 triaged + 2 isotopic + 15
beyond-±1).

Slices 1-2 — outcome (2026-10-23, inchi-rs#7 + #8): mobile-H groups
gate live, and the canonicalization is rebuilt as the reference's
actual two-stage base flow. Stage 1 is hydrogen-blind (invariants,
refinement, individualization, greatest table) and collects
automorphism orbits from table-equal terminals; stage 2 rebuilds the
initial partition from (orbit-minimal base rank, hydrogen count),
orders candidates by that auxiliary rank (CellGetMinNode with
nAuxRank), skips automorphic repeats, and keeps the greatest
(table, H) terminal. The heavy-atom numbering itself is
t-group-independent (617/617 verified).

**Goal item 2 achieved: all nine previously triaged /c and /h
disagreements retired — breadth-448 included** (its labeling was
never unreachable; it lives in the stage-2 ordering). Residue: 98
tautomer-parity entries (ring-conjugated and nitro/aci template
merges; the ichitaut port retires them) plus 11 stage-2
orbit-representative entries (auxiliary-ranking construction
fidelity) — triaged v0.1.3/v0.1.4; S/P structures skip until the
S/P valence model lands.

Refinements (inchi-rs#10) sharpened the boundary without shrinking
it: shift paths may anchor and pass through endpoints, nitro-N
donors stay fixed — group membership reshuffles, the count stays
180. A zero-skip corpus release (v0.1.6) was made prematurely and
REVERTED by v0.1.7 (entries restored with a dated amendment; the
record names the reversal).

Next slices:

1. Aromaticity perception + delocalized-bond templates (the residue's
   root: amino-azine ring tautomerism runs over delocalized ring
   bonds) — retires the tautomer-parity and S/P-adjacent entries.
2. Auxiliary-ranking construction fidelity (11 entries).
3. Then M4 stereo.

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
