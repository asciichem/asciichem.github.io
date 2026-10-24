# 66 — Native InChI engine (three-repo program)

- **Priority:** P2
- **Status:** in-progress — M0-M2 green; M3 mobile-H at corpus v0.2.3
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

The aromaticity slice (inchi-rs#11, corpus v0.1.8/v0.1.9): Kekulé
ring perception marks ring bonds aromatic; the shift walk crosses an
aromatic bond in either parity; the 1,5 walk terminates on a double
bond (phenol OH's and quinones stay fixed). **The gate now compares
every fixture and classifies the result — pass, expected-failure
skip (triage), RETIREMENT (asserted empty: a triaged fixture that
passes blocks CI until its entry is withdrawn), isotopic,
beyond-±1** (inchi-rs#12): the triage-skip measurement hazard that
produced two vacuous zero-failure readings is designed out — and it
immediately proved itself by catching corpus v0.2.0, which triaged
two fixtures from a skipped-comparison run (recorded as false;
v0.2.1 restores the measured set). The S-endpoint experiment
(thioamide groups) was reverted as net-negative — sulfurs over-merge
through aromatic and phosphate systems. Residue: **175 expected
failures** (quinone/azine phase bookkeeping + thioamide/aci cases),
all dated; ground truth stable at pass 1337 / skips 175 / iso 2 /
beyond-±1 15.

The thio-acceptor slice (inchi-rs#14, corpus v0.2.2): S joins a
mobile group only as a thiocarbonyl acceptor (=S off a carbon) or a
capable S-H/thiolate donor — never as an S=O or sulfide single bond.
**23 entries retired: residue 152** (pass 1337, retirements asserted
zero post-withdrawal). Also lands the v0.2.1 pin that a working-tree
switch had silently dropped from inchi-rs main.

The residue diagnostic (inchi-rs#15) decodes the 152 into two
patterns the template table must encode:

- **73 extra-groups**: 1,5 walks cross BETWEEN ring systems (a
  hydroxyquinone hydroxyl joining a neighboring carbonyl through the
  aromatic ring) where the oracle's template stays within one ring
  or exocyclic system.
- **63 members-differ**: same endpoints, different pairing — the
  oracle pairs each endpoint with its adjacent anchor's partner
  ((H,7,8)(H,9,10)); ours pairs across anchors ((H,7,9)(H,8,10)).
- 16 missing-groups.

The template-table slice (inchi-rs#16, corpus v0.2.3): the ichitaut
endpoint semantics ported — endpoint valence arithmetic (O/S/Se/Te 2,
N 3; the H + bond-sum fill decides donor vs acceptor; overflow
disqualifies, so nitro N and sulfone S drop out without special
cases), complementary-role shift walks with the π-run grammar, and
stage-2 ranking on numHNoTautH (mobile H removed — the members-differ
half of the decoded residue was terminal-O ordering, not pairing).
Also fixes the #11 aromatic-marking bug (the cycle loop inserted atom
numbers as bond indices). **92 entries retired: residue 64** (pass
1356, iso 2, beyond-15). The 4 new entries share one signature — the
reference's iterative re-registration (pass-1 tautomeric bonds change
what pass 2 sees) — recorded dated; retire with an
iterative-registration port if M4+ leaves room.

## M4 — slice 1: tetrahedral `/t` `/m` `/s` — DONE (2026-10-24)

Landed (inchi-rs#17, corpus v0.2.4): the reference's atom parity
ported — heavy ligands in neighbor order (molfile bond order) lifted
to 3D with the wedge z = ± drawn length, the implicit hydrogen
closing the tetrahedron at −(sum), the triple product of ligands 1,
2, H from ligand 0 giving odd/even, inverted once for the appended H,
composed with the input→canonical permutation and one global
convention constant. `/m` is the first center's parity; the meso case
(same-orbit centers, opposite parity) emits bare `/t`. The decode
journey is the lesson: bond-order-only parity models fail (the wedge
sign reaches the parity only through the H closure), the neighbor
order is bond order not atom-number, and the `/m` n-term was an
artifact of fitting against the pre-closure parity. Validated on the
20-fixture stereo tranche (inchi-tests#15: enantiomer pairs, adjacent
dicentres, both meso forms) — 20/20 — plus the 12-layout probe grid
and the 4-case dichlorobutane grid as unit tests. Original probe
notes kept below for the record.

Probed with the dev-time oracle (1.07.5, file interface; record
options `-AuxNone -NoLabels -Key`):

- The V2000 atom-parity field is IGNORED for 2D input, and so are
  wedges with degenerate (zeroed) coordinates — the stereo input
  contract is a real 2D layout PLUS a wedge (1) / dash (6) bond-stereo
  code whose FIRST atom is the stereocenter (the gem's molfile writer
  already emits exactly this shape: centre→neighbour, TH1 up/TH2
  down, with layout).
- Single-center evidence (2-butanol, center = canonical rank 4):
  every reading emits `/t4-`; the enantiomers differ ONLY in `/m`
  (wedge to the rank-2 ligand up → m1; to the rank-3 ligand up →
  m0; dash flips it). Model: `m = input_parity ⊕ parity(input→canonical
  ligand permutation) ⊕ const`, `t` char per-center with H as the
  last ligand — pin the constant and the H-placement rule with
  two-center probes (pseudoephedrine pair) during implementation.
- Work: molfile.rs reads the bond-stereo field; perception = wedge
  atoms with 4 distinct ligands (implicit H included); canonical
  parity = input parity composed with the ligand permutation under
  canonical ranks; emit `/t…`, `/m…`, `/s1`; the gate starts
  comparing the t/m/s kinds.
- Corpus: a stereo tranche recorded from parity+wedge molfiles the
  gem writes (the seed alanine pair is the pattern); breadth stays
  coordinate-free.

## M4 — slice 2: double-bond `/b` — DONE (2026-10-24)

Landed (inchi-rs#18, corpus v0.2.5): the oracle honors E/Z from 2D
coordinates (cis/trans bond codes untested — coordinates are the
carrier the gem layouts provide). A stereogenic double bond needs two
distinct ligands at each end (terminal =CH2 out) and sits outside
rings smaller than 8; the reference ligands are the highest canonical
ranks at each end, and the sign is + when they lie on opposite sides
of the drawn bond, − when on the same side. Degenerate or collinear
layouts carry no stereo — the coordinate-free breadth corpus records
no /b, exactly as the oracle behaves over the same coordinates. Pair
format: endpoint ranks descending (b4-3+); /b orders between /p and
/t (the order constants had T and B swapped). Validated 10/10 on the
E/Z tranche (inchi-tests#16, recorded over hand-laid layouts since
the gem writer does not yet carry E/Z through its layout — the
stereo-ez-molfile-loss class documents that). Layer order: /b, /t,
/m, /s.

Next slices:

1. M5 InChIKey, then M6 bindings, M7 integration, hardening.

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
