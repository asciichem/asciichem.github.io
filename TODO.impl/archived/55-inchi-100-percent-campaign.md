# 55 — InChI 100% campaign: the remaining slices

Status: **COMPLETE** (2026-11-10) — ledger ZERO. Every dated triage
entry accepted (2 TAUT-numbering, 11 center-free stereo-walk, 6
salt-bit conjunct), all decoded with instrumented-oracle evidence and
shipped across the engine + runtimes; corpus v0.3.41, 21 gates green.

Status 2026-10-25. The inchi-rs engine is **byte-identical to the
oracle on every fixture it attempts** under the full-equality gate
(inchi-rs#28: pass 5238 / triage 260 / beyond-±1 61 = 5559, zero
unclassified). Shipped this far: the salt/charge + `/q` slice
(inchi-rs#26 + the Ruby mirror inchi-engine#20), the `/i` isotope
layer (inchi-rs#27), the full-equality gate, corpus v0.3.2. The
remaining distance to literal 100% is exactly the triage file plus
the beyond-±1 class, in three slices:

## 1. The exact ichitaut machinery (the ~200 h-template entries)

Port the reference's tautomer perception faithfully from
`/tmp/INCHI-src/InChI-1.07.5/INCHI-1-SRC/INCHI_BASE/src/ichitaut.c`
(~7000 lines) + `ichi_bns.c`. **The template inventory is decoded
(2026-10-25, day 2) — the over-tautomerization subclass is NOT a
generic conjugated walk.** `mode.h` gates exactly these templates:

- `TAUT_15_NON_RING` — the 1,5 walk; requires ONE endpoint off-ring
  (a dihydro-azine's two ring N never pair: breadth3-1054's
  refused group was an acceptor-started walk across fused rings).
- `TAUT_4PYRIDINOL_RINGS` — 6-member rings: N endpoint (valence 3,
  ring degree 2), `nNumAtInRingSystem >= 6`, walked by
  `nGet15TautIn6MembAltRing` to the para acceptor.
- `TAUT_PYRAZOLE_RINGS` — 5-member rings: two adjacent ring N's
  (each degree 2, endpoint valence 3, same ring system, total
  mobile H == 1 for fresh pairs), `nGet12TautIn5MembAltRing` — the
  imidazole/purine class (breadth-342's allowed `(H,8,9,10)`).
- `nGet14TautIn5MembAltRing` — the tetrazole 1,4 class.
- `KETO_ENOL_TAUT` + the `TAUT_PT_*` rules — extend ENDPOINTS TO
  CARBON (endpoint valence 4 for C; `nGetEndpointInfo_PT_22_00`
  et al.) — the enol-carbon endpoints our machinery lacks entirely.
- The 1,3 anchor loop: the search starts from an endpoint reaching
  its centerpoint via a DOUBLE/ALTERN bond (`is_centerpoint_elem`
  on the anchor).

Day-2 lesson (recorded so it is not re-learned): blanket
approximations fail BOTH ways — a chalcogen-only walk rule retired
41 but broke 351 (biguanide-class imine walks are real); the
off-ring 1,5 rule retired 9 but broke 21 (imidazole ring walks are
real). The classes interleave; only the exact per-template
conditions (which need per-atom ring membership + ring sizes +
ring-system ids — bridge finding is not enough) separate them.

**Day-3 lesson (2026-10-26): even the exact templates on static
facts fail.** A port with ring perception + the pyrazole template +
the off-ring rule + iterative registration (registered atoms as
anchor donors) retired 13 but finished NET −2: breadth2-413/118
keep splitting their groups because the reference RE-MARKS bonds
BOND_TAUTOM as groups register (SetTautomericBonds), and later
anchor scans read those marks as either-role bonds. The anchor
scans also consult `at[endpoint].endpoint` — membership — which a
static endpoint() cannot express. **The port must be MarkTautomerGroups
wholesale: an iterative state machine where atoms carry
registration state, bonds carry tautomeric marks, and every round
rescans against the current marks, registers, and re-marks.** The
radar/debugger are merged (inchi-rs#29: examples/triage-census.rs,
group-trace.rs); run `cargo fmt` before every commit.

**Day-5 status (2026-10-26): Slice B scoped to a loop-faithful
descent port.** Two experiments (strict-greater terminal rule;
atom-number candidate order — alone and combined) were
CONFIRMED-NEUTRAL: gate green, zero retirements, both reverted.
CellGetMinNode decodes as aux-ranked (our candidate order is
correct) and the reference's terminal rule is strictly-greater
(first-of-equal-max — ours matches). The residual /c-tie
difference is the descent MECHANICS: the reference's loop is
level-resumable (v[k] continues from the last-tried node per
level; e[k] exhausted flags; persistent W[k] cells; the L12
W∩Omega intersection) while our descend_hinformed re-enumerates
fresh. Remaining work: replace descend_hinformed with a
loop-faithful port of the reference's L2/L4/L13/L14 loop
(lab-only — pzb_rho_fix is NULL in our use, dropping the rho-fix
layer), keeping nAuxRank = the (symmetry, H) aux.

**Day-7 dissection (2026-10-26): breadth3-376 enumerated to the
atom.** All 12 of our terminals agree on positions 0–9 and swap
only 9/10 at the tail; the oracle's /c differs in the MIDDLE ring
atoms — a labeling our search tree never generates. The /c ties
are the refinement+descent structure itself (the reference's
PartitionColorVertex numbering), not any rule. Also verified: the
orbit fold must use FULL-CT equality (table+H+t-group rows — a
9/10-swap pair differs in its t-group rows and is not
automorphic; folding it prunes the oracle's branch). The
corpus-neutral pieces (full-CT terminal compare merged as
inchi-rs#30; the full-CT fold) re-apply with the state machine.
Slice B's one remaining act: port PartitionColorVertex + the
resumable loop, together.

**Day-8 verification (2026-10-26): individualize and refine are
already faithful** (PartitionColorVertex's shift-and-rerank;
DifferentiateRanks3's sort-by-neighbor-lists + consecutive
ranks), and the seed theory was REFUTED — the reference's pi[0]
invariants INCLUDE hydrogens (bHydrogensInRanks=1); the
symmetry-only-seed experiment broke 105 fixtures and was
reverted. The remaining unverified mechanics, in test order: (a)
L12 CellIntersectWithSet (W∩Omega pruning at exhausted cells),
(b) the resumable v[k] continuation semantics, (c) the exact
bSplitTautCompare section ordering.

**Day-10 SOLVED (2026-10-27): the /c ordering ties.** The
reference's pi[0] is the H-FREE (element, degree) partition
(bHydrogensInRanks=0); our search had seeded from the
(symmetry, H) aux partition, fencing a CH and a CH2 into
different cells so the oracle's numbering was unreachable. The
seed is now the H-free invariants refined; the aux only orders
candidates; the smaller-H terminal rule re-applied (with the tree
open it emits the oracle's recorded /h layers). 7 triage entries
retired (corpus v0.3.3) — both /c ties, breadth-910,
breadth2-613/940/980/1035. inchi-rs#31 + inchi-engine#21 merged;
engine corpus pin caught up v0.3.1 → v0.3.3 (the v0.3.2 bump had
been lost to a wrong-repo edit). Scoreboard: **pass 5245 /
triage 253 / beyond-±1 61 = 5559.** Remaining: the ichitaut
template machinery (Slice E — the state machine + equivalence
refinement), beyond-±1 (Slice D, retires with E), and the
triage file's remaining classes.

**Day-11 continued (2026-10-27): the template port LANDED.** The
ring templates + the state machine re-applied and shipped as
inchi-rs#34 + corpus v0.3.5 (inchi-tests#24): 139 retirements, 13
newly triaged, ZERO mismatches — 5371 of 5559 effective (baseline
5245/253). The pieces that made it work, in the order decoded:
(1) the DFS engines (DFS_FindTautAltPath / DFS_FindTautInARing) —
closure only into the start atom at exact cycle length, DfsPath[i]
= the bond LEAVING atom i; (2) the BNS cap rule as a local rule —
an intermediate relays a 1,5 shift only with valence slack (bond
orders + H below the standard valence: a saturated sp3 CH2 blocks,
an aromatic/sp2 atom relays) — took the 1,5 walker from 223
over-merges to clean; (3) the aromatic SPLIT the reference keeps:
perceived-aromatic bonds read BOND_ALTERN (wildcard in
are_alt_bonds; either-role in the 1,3 scan) while the valence
arithmetic carries the input kekule's INTEGER orders — an N-H
classifies only in integers (aromatic 1.5 made NH 4 ≠ 3 and killed
every ring-NH start). Three seesaw runs proved no single rule set
suffices: templates-only = 139 retire + 13 under-merges; +the old
aromatic walks = 0 under-merges but only 14 retire (the walks wreck
the 125); the honest resolution ships templates-only and TRIAGES the
13 with their root cause. **The 13 (breadth-19/56/127/540/1035/1338,
breadth2-157/413, breadth3-15/616/1585/1588/1666) need
bExistsAnyAltPath (ALT_PATH_MODE_TAUTOM) — the cap-aware BNS
augmentation (ichi_bns.c RunBalancedNetworkSearch) — the next
slice.** After that: the keto-enol PT endpoint extension
(KETO_ENOL_TAUT, the TAUT_PT_* carbon endpoints).

**Day-12/13 SHIPPED (2026-10-28): the balanced-network port landed —
inchi-rs#35 + corpus v0.3.6 (inchi-tests#25). 12 retirements, ZERO
mismatches — pass 5371 / triage 115 / beyond-±1 61 = 5559.** The 13
BNS-relayed under-merges are gone (12 of them byte-identical; the 13th
was never triaged). What the port taught, in decode order:

1. `src/canonical/bns.rs` is the faithful ichi_bns port: network build
   (input-order bond edges, flow = order−1, cap = min(MAX_AT_FLOW)
   clamped 2; AddTGroups2BnStruct's endpoint-ascending group vertices,
   donor edges flowing, the single-like capacity raise), the TAUTOM
   setup (role precheck `registered || cDonor/cAcceptor`; reject when
   the double side's st-flow is 0; pin v1's group edge to flow 1 /
   v2's to 0 via bSetFlowToCheckOneBond's grab arithmetic; the temp
   dot on v2; bAddStCapToAVertex's blanket cap raise), the Kocay-Stone
   mirror search with blossoms (queue-order fidelity matters: x_O2
   queued before x_T decides which blossom forms), the `2*ret >= nDots`
   verdict over up to 16 passes, both directions from fresh networks.
2. The 1,3 anchor is ENDPOINT-anchored (MarkTautomerGroups scans
   endpoints, then π-class centerpoints — not centerpoints), and its
   admitted endpoint set is partitioned by FindAccessibleEndPoints
   (BNS-pair equivalence classes, min-merge, IGNORE_SINGLE_ENDPOINTS)
   before RegisterEndPoints' `!nGroupNumber || bDiffGroups > 0` gate.
   Same-group pairs skip the BNS everywhere except the 1,5 check
   (which early-returns on same-group).
3. **The decisive find: the non-ring 1,5 walk NEVER RUNS in the
   standard flow.** TAUT_15_NON_RING is compile-on but runtime-gated
   by TG_FLAG_1_5_TAUT, set only from `b15TautNonRing` (ichiparm.c,
   default 0). Our unconditional 1,5 walk was the entire 338-over-merge
   regression (breadth-47's keto-enol O=C-C=C-OH pair: walk-legit,
   BNS-confirmable, and still refused by the oracle — because the
   oracle never walks 1,5 at all). The instrumented oracle trace
   arbitrated: breadth-47 = ONE MarkTautomerGroups call, no BNS calls.
   Only the 6-member, pyrazole, and tropolone families run (all three
   compile-on, runtime-ungated), plus the 1,3 anchors.
4. The tropolone check keeps the reference's wrapper-level collection:
   Check7MembTautRing adds endpoints/bonds BEFORE its BNS call, so a
   network-rejected pair's entries linger and a later accepted pair
   registers the whole accumulation.
5. Process: the corpus-pin sequencing is corpus PR → tag → engine pin
   bump riding the engine PR (the 12 retirements block engine CI until
   the pin catches up); the org has BOTH `inchi-rs` and `asciichem-rs`
   — the wrong slug 404s confusingly ("No commits between main and...").

Remaining distance: the 115 triage entries (the charged-site formula-H
class = Slice D, the /p standardization tail) and beyond-±1 (61). The
over-tautomerization subclass (task #94) needs a fresh census — the
1,5-walk removal may have dissolved it. The keto-enol PT endpoint
extension (KETO_ENOL_TAUT, TAUT_PT_* carbon endpoints) stays OFF the
standard flow too (same ichiparm defaults) — likely a non-goal for
parity.

**Day-14 SHIPPED (2026-10-29): the forbidden edges — inchi-rs#36 +
corpus v0.3.7 (inchi-tests#26). 8 retirements, ZERO mismatches —
pass 5383 / triage 107 / beyond-±1 61 = 5559.** The decode that
unlocked it: a rebuilt instrumented oracle (the /tmp tree had been
wiped; re-fetched + the recorded build fixes; only the PAIR/ENDPTS/
ADMIT prints re-applied — cheap) showed carbamic acid's C–N bond
carrying `forb=1`: **SetForbiddenEdges (ichi_bns.c:2002, called once
at BNS allocation, BNS_PROTECT_FROM_TAUT)** marks the acetyl pattern
(C valence 3 cbv 4, two valence-1 O's summing to 3) and the nitro
pattern (N valence 3, cbv 4|5, two valence-1 O's summing to 3|4) —
the single-bonded non-O bond — and that bond is invisible three ways:
the anchor's entry scan (ichitaut.c:4432), the centerpoint endpoint
scan (:4453), and the network traversal itself (IS_FORBIDDEN in
GetVertexNeighbor + the setup's flow grab). That is why carbamate
fixes its NH2 while acetamide (one oxygen) keeps the amide pairing.
Ported as `forbidden_edges` + two anchor gates + impassable edges in
bns.rs. 26 of the 115 triage entries carried the pattern; 8 retired
outright — the other 18 also need the charge machinery (c-groups).
Battery findings recorded for the charge slice: acetamide groups
(H2,3,4); urea groups (H4,2,3,4); carbamate (neutral AND anion)
fixes the N and groups only the O-pair; aci-nitromethane anion
CH2=N(=O)O⁻ emits NO group at all (`h1H2/q-1` — the charge never
becomes mobile).

**Day-13 census (2026-10-28): the 115 triage entries decompose as
64 formula-H/charge + 50 tautomer/template + 1 /c ordering tie.**
The tautomer-labeled entries are dominated by the CHARGE-GROUP
machinery we never ported: the `(H4-,22,23,...)/p+1` mobile-negative
groups (breadth-53/78/91 — S/P-adjacent normalization residue),
the anionic-carrier class (breadth-24's nitronate: oracle `h2H2,(H,3,4)`
vs our `(H3,2,3,4)` — the riding proton lives on the group, not the
carbon), and the sugar H-count /c ties (breadth-39/92). **The next
slice is the charge-group machinery: MarkChargeGroups + c-group
vertices in the BNS + GetNeutralRepsIfNeeded's neutral-replacement
(the piece deliberately skipped — it is a no-op only for neutral
fixtures) + MarkSaltChargeGroups.** That single mechanism is what
the 64+ and most of the 50 share. **Flag check (same lesson as the
1,5 walk, settled first this time): TG_FLAG_MOVE_POS_CHARGES IS ON
in the standard flow** — `bMovePositiveCharges = (MOVE_CHARGES == 1)`
(ichiparm.c:642) and mode.h pins MOVE_CHARGES 1. The reference's
charge machinery (MarkChargeGroups, AddCGroups2BnStruct's c-group
vertices in the BNS, GetNeutralRepsIfNeeded, the long-range N(+)/P(+)
movement, and the c-group flow pinning inside the TAUTOM setup) all
runs — our port skipped every piece of it as "no c-groups". NOTE:
the /tmp reference tree was wiped between sessions; it re-fetches
from IUPAC-InChI/INCHI v1.07.05 + the legacy headers (the recorded
procedure), but the day-12 instrumentation patches are NOT preserved
anywhere — re-instrument from the print-class list in the day-12
entries if runtime traces are needed again. Entry map for the decode
(ichitaut.c): MarkChargeGroups:2397 collects GetChargeType
candidates (N/P atoms, charged vs C_SUBTYPE_NEUTRAL), sorts
(type, charged-first), pairs charged↔neutral of the same type into
c-groups confirmed by an ALT_PATH_MODE_CHARGE alt-path check;
MarkSaltChargeGroups:3483/3753 is the acid-salt complement;
AddCGroups2BnStruct (ichi_bns.c:9406) builds the c-group vertices
the TAUTOM setup's c-group branch pins. The driver loop interleaves
MarkChargeGroups with MarkTautomerGroups until both are change-free
(ichi_bns.c:5524/5682).

**The charge-group PORT SPEC (fully decoded 2026-10-29; implement
mechanically next session):**

1. `GetChargeType` (ichitaut.c:2181): candidates are atoms with
   |charge|==1 (rejecting ion-pair neighbors: a neighbor whose
   charge flips the sign and is NOT a tautomeric endpoint) or
   charge 0, matched against CType[] — N (type 0) and P (type 1);
   ADD_MOVEABLE_O_PLUS=1 adds O (type 2), S (3), Se (4), Te (5)
   with num_bonds==2 AND ring-system >= 5 — via `bCanBeACPoint`
   (:2047), which classifies by (charge, valence, cbv, num_H):
   charge==cCharge && valence==cbv && num_H>0 → NOT a point but a
   p-DONOR subtype note (returns 0); charge==cCharge && valence <
   cbv with cbv+H == neutral_cbv+1 and bonds+H ∈ {neutral_valence,
   neutral_valence−1} → CHARGED_* subtypes (H_DONOR when the
   endpoint valence allows H, else NON_TAUT); charge 0 or −1
   (the anion counts +1 fictitious bond) with cbv+H+neg ==
   neutral_cbv and bonds+H+neg ∈ {neutral_valence (NEUTRAL_*),
   neutral_valence−1 (H_ACCEPT_p_ACCEPT for endpoint elements,
   NON_TAUT for P)}.
2. `MarkChargeGroups` (:2397): collect candidates once, sort by
   (type, subtype, atom), then for each charged candidate iat1 test
   each neutral candidate iat2 of the SAME type with
   `bExistsAltPath(..., ALT_PATH_MODE_CHARGE)` — SINGLE DIRECTION
   (charged = double side, neutral = single side), not AnyAlt;
   `ret & 1` → RegisterCPoints (pair/merge into c-groups;
   at[].c_point = the contiguous group number; num[0] = charged
   points, num[1] = proton count). nDelta > 0 → quick_exit (the
   driver re-runs everything).
3. ALT_PATH_MODE_CHARGE setup = the GENERIC branch (type is not
   ENDPOINT): temp vertex on v2, add_st_cap on v1 — NO group-edge
   pinning. bChangeFlow = CHNG_RSTR | ALTR_BONDS: on success the
   changed bonds get BOND_ALTERED marks in at[] (our bond-type
   model needs an altered-mark state the templates read as
   alternating).
4. `AddCGroups2BnStruct` (ichi_bns.c:9406): c-group vertices after
   the atoms (their own gid space), st cap/flow = the count of
   NEUTRAL c-points, each c-point edge cap 1 with flow 1 for
   !CHARGED_CPOINT (the neutral side carries the group's unit);
   the cap raise = FIX_CPOINT_BOND_CAP==1's variant (min of
   neighbor cap, point cap, MAX_BOND_EDGE_CAP; +1 more when the
   c-group edge flows and the bond is a multiple).
5. The TAUTOM setup's c-group pinning (ichi_bns.c:7237-7274, the
   branch our port skips): GetEdgeToGroupVertex(v, C_GROUP) for v1
   AND v2 → set flow 1 on each (no positive charge while moving
   tautomeric H).
6. `GetNeutralRepsIfNeeded` (ichitaut.c:1565): in
   FindAccessibleEndPoints, when both reps share a c_point, at
   least one is +1, and c-groups exist — replace the charged rep
   with a neutral member of its t-group (EndPoint[] first, then
   the whole t-group; the "replace only once" c_point rule).
7. Driver interleave: MarkTautomerGroups until 0 → if anything
   changed, ReInitBnStructAddGroups + MarkChargeGroups loop
   (do-while ret>0) → repeat the whole main cycle until nothing
   changes anywhere.

Target classes: the 64 formula-H/charge entries + most of the 42
tautomer-labeled ones (S/P-adjacent (H4-,...)/p+1 groups, the
breadth-53/78/91 class). The aci-nitromethane battery result
(`h1H2/q-1`, no group) is the guard case: the charge must NOT
become mobile there.

**Day-14d DECODED (2026-10-29): the salt/charge machinery — the last
big mechanism (the (H4-,...)/p+1 class).** breadth-53's oracle merges
our four local groups into ONE 10-member super-group {adenine
NH2/ring-N's + both phosphates' OH oxygens} with 4 H and a 1 deficit,
/p+1 (the N+). The machinery, decoded from ichitaut.c:

- `GetSaltChargeType` (:2569): a salt candidate = TERMINAL
  O/S/Se/Te, standard valence (cbv + H == element valence for the
  charge), attached to an UNSATURATED carbon (cbv == 4, no H under
  SALT_WITH_PROTONS=0 — =1 widens to =C(H)-OH/-C(H)=O; the flag is 1
  in mode.h:578, so the proton-bearing carbons participate),
  uncharged carbon, not a radical. Subtypes: SALT_DONOR_H (has H),
  SALT_DONOR_Neg (charge −1), SALT_ACCEPTOR (cbv 2, the C=O); for
  t-group members the subtypes come from the GROUP's (num[0] >
  num[1] → H-donor; num[1] → Neg; always acceptor).
- `GetOtherSaltChargeType` (:2706): the N analog.
- The pairing (MarkSaltChargeGroups :3483, the loop at :3640-3695):
  every donor-subtype candidate × acceptor-subtype candidate (BOTH
  orders), confirmed by bExistsAltPath(ALT_PATH_MODE_4_SALT) — on
  success RegisterEndPoints merges the TWO ATOMS AS A T-GROUP (the
  salt merge reuses the t-group registration — our state.register
  port serves directly). The gates: at least one ACCEPTOR candidate
  overall; without ALLOW_NO_NEGTV_O at least one Neg/H donor.
- `MergeSaltTautGroupsBlind` + `ConnectSaltTGroups2SuperTGroup`:
  merge the salt-pair t-groups with adjacent t-groups, then connect
  everything sharing atoms into ONE SUPER T-GROUP (the 10-atom
  group of breadth-53).
- The setup for the salt BNS = the TG_FLAG_TEST_TAUT2_SALTS branch
  of bSetBnsToCheckAltPath (ichi_bns.c:6827, the table branch):
  v1/v2 group lookup, the bAddNewVertex/bAddStCapToAVertex pattern
  from the table (donor side: group gets the fict vertex; acceptor
  side: the atom).
- The OUTPUT restructure: the super-group's (H{n}{-},...) = the
  group's num[0] (H + charges) and num[1] (charges); the charges
  leaving /q for /p (the cation's + rides /p+1); the formula counts
  the post-normalization H (26 vs our 27 — the standardization H
  that our rule keeps is ABSENT when the charge rides the group).

Implementation order for the next session: (1) the salt candidate
classification + pairing round (reusing state.register + a new
4_SALT mode in bns.rs — the TEST_TAUT2_SALTS setup branch); (2) the
merge/connect passes (group unions); (3) the /h group-charge
emission + the formula/(/p) restructure. Guard cases: acetate
(stays (H,3,4)/p-1 — the salt pair IS the whole group), breadth-53
(the super-group), the aci-nitromethane formula divergence.

**Day-14c SHIPPED (2026-10-29): the alternation normalization —**Day-14c SHIPPED (2026-10-29): the alternation normalization —
inchi-rs#38 + corpus v0.3.8 (inchi-tests#27). 10 retirements, ZERO
mismatches — pass 5391 / triage 97 / beyond-±1 61 = 5559.** The
ENTIRE BNS-relayed under-merge class is retired (breadth-540/1035/
1338, breadth2-157/413, breadth3-15/253/616/1585/1588). The decoded
mechanism — the SECOND bonds normalization, BnsTestAndMarkAltBonds
(ichi_bns.c:5582 before the main cycle AND :5715 after each change
round, with t-groups present): probe every allowed bond at its other
achievable flows (min = flow − min residual around the endpoints'
other edges; max = the edge cap clamped 2); pin via bSetFlowTo
CheckOneBond; when the network rebalances (2*ret == dots exactly, or
the trivial dots==0 pin) the bond and everything the probe moved
read BOND_ALTERN — wildcard in are_alt_bonds, either-role in the
anchor scan — while the valence arithmetic keeps the input orders.
The oracle's per-probe prints on breadth2-413: pass one (plain
network) all infeasible; pass two (with the {O,N} group) pins the
ring C=C to single and the rebalance lands IN THE T-GROUP → the
whole ring reads alternating → the next anchor scan admits the ring
=N through its alternating bond → the 3-member group. PORTING LESSON
that cost the day: the fixpoint loop must RESET `changed` per round
(a `changed |=` accumulation silently disables the walk/charge/
alternation phases forever after the first registration round).

**Day-14 status: the machinery SHIPPED (inchi-rs#37, gate green**Day-14 status: the machinery SHIPPED (inchi-rs#37, gate green
pass 5391, zero mismatches, zero regressions — the battery
carbamate/acetamide/urea matches). The corpus-moving half is the
CHARGED-GROUP OUTPUT layer, and its decode is done:** the INChI
wire stores t-groups as `nTautomer = (NumAt+2, NumH, Num(-),
At1..AtNumAt)` (ichi.h:229 — INCHI_T_NUM_MOVABLE=2) — the group
carries its H count AND its negative-charge count; AddAtom2num's
num[1] (the charge==-1 count) IS Num(-); the (H4-,...) /h notation
prints H{NumH} plus '-' when Num(-)==1. Our MobileGroup needs a
charge field (Σ(charge==−1) over members — the standardized counts
already carry the anion H), the /h emitter the `-` suffix, and the
formula layer must count the group's H WITHOUT adding the /p
standardization proton when the charge rides in the group
(breadth-53: oracle C21H26... (H4-,...)/p+1 vs ours C21H27...
no group). The aci-nitromethane anion (breadth-24 class) keeps a
FORMULA divergence (ours CH3NO2 vs oracle CH2NO2) — the Slice-A
anion-H rule, separate.

**Day-11 decoded and reverted (2026-10-27): the phase gate + the
seesaw.** The state machine's over-merges had TWO root causes, both
read out of ichitaut.c: (1) the entire walk/ring-template block sits
under `if (!tot_changes)` — the templates run only on a
MarkTautomerGroups pass whose 1,3 anchor phase registered nothing
(the driver then re-runs the anchors first); my machine interleaved
walks into every round. (2) SetTautomericBonds marks ONLY the bonds
to admitted endpoints (BondPos is filled before the
`!bPossiblyEndpoint → continue`), not all centerpoint bonds. With
the phase gate, cytidine (breadth-152) registers its guanidine
wholly in the 1,3 phase and its carbonyl O never meets a walk: all 9
over-merges cleared. `nGetEndpointInfo` is also now fully decoded:
an endpoint needs `nMobile + chem_bonds_valence == nEndpointValence`
exactly; role = `cbv − valence` (0 donor, 1 acceptor); `=NH` (H
would overflow) is NOT an endpoint at all. **But the reorder
regressed 5 baseline-passing ring-class fixtures** (breadth2-118/
413/1041, breadth3-1666/1815) — my walk lacked the ring coverage the
static machinery had — and dropping the off-ring condition to
recover them re-broke 9 of the 13. The seesaw is rule-level: the
over-merge stopper and the under-merge fixer are the same mechanism
in the reference (its per-template ring walkers). Both merges were
reverted via PRs (inchi-rs#33, inchi-tests#23; the v0.3.4 corpus tag
stays as history). **The next state-machine attempt must land WITH
the ring templates: TAUT_4PYRIDINOL_RINGS (nGet15TautIn6MembAltRing),
TAUT_PYRAZOLE_RINGS (nGet12TautIn5MembAltRing),
nGet14TautIn5MembAltRing, and the exact nGet15TautInAltPath
conditions** — each needs ring-system membership + ring size, not
bridge-finding alone. Also fixed this day: process — never merge a
PR while its check is pending; the post-merge red is what a pending
check was hiding.


and TRACES.** The /tmp/INCHI-src tree compiles (two build fixes:
a shuffle stub + permutation_util.o in the exe makefile; binary
at INCHI_EXE/bin/Linux/inchi-1) with `INCHI_TRACE=1` printing the
descent (level, chosen vertex, cell) and terminals; our search
carries the mirrored SEARCH_TRACE/SEARCH_DEBUG. The breadth3-376
side-by-side: the reference's tree branches at {molfile 1,3} with
3 terminals; ours branches at the carboxyl O pair with 12 — the
root partitions differ because the reference's canon input is
POST-normalization (endpoint num_H redistributed by registration;
the input's arbitrary H location is gone), while our seed H still
carries it. Raw-H seeding tested and refuted catastrophically
(pass 1835 — the oracle is input-H-blind). The seed's H must be a
normalized quantity. The trace-diff workflow replaces theorizing:
rebuild the traced reference, run both on a fixture, diff the
descents line by line.

**Day-4 result (2026-10-26): the state machine BUILT — and the
last subsystem found.** The wholesale port (Registration state,
rounds over anchors/pyrazole/off-ring-walks, mark-all-anchor-bonds
on registration) retired 13 but over-merged 6 (amidine class):
the oracle's final group excludes an amidine =N that the templates
admit mid-flight. The final t-groups **refine over automorphism
equivalence orbits** (the reference's t-group equivalency rebuild)
— endpoints split by canonical equivalence before the /h layer
prints them. **The campaign converges: Slice B (the /c ties) and
the t-group refinement BOTH need the automorphism-orbit machinery
(CanonGraph L10-L13). Port the orbit machinery FIRST; the state
machine is then finished by the refinement pass.** The day-4 state
machine was reverted clean with the gate green at 5238; its exact
shape is recorded in the roadmap memory (day-4 entry) for the
next session's starting commit.

## 2. /c ordering ties (7 entries) — the orbit-pruning port

The tie-break lives in the reference's search order: CanonGraph
(ichican2.c) accumulates automorphism generators at equal-CT
terminals (L10), joins their orbits (theta), and prunes candidates
that are not their own orbit representative (L14) — our search lacks
the dynamic orbit pruning, so a different equal-max terminal wins.
Port the pruning to match exploration order exactly.

## 3. beyond-±1 (61 entries) — retires with slice 1

ChargePlan already sums magnitudes; the blockers decoded 2026-10-25
(see the roadmap memory): bare oxyanions stay /q−n (peroxide,
silicate, phosphite), the nitrate class holds ONE parent H on its
charged =O-bearing no-C N center (silent co-anions), the proton
balance does not simply close under coexisting fixed cations
(breadth-112 vs breadth-372), and the iminium-vs-aromatic-N⁺ split
(breadth-246-class p vs breadth-37 q) needs the kekulized
aromaticity perception — the same root the /c ties and the
amino-azine tautomer residue share. The reference decides these
through the BNS alt-path per molecule; local rules kept re-breaking
each other. Port the machinery, not more rules.

## Working conventions for this campaign

- Reference source at /tmp/INCHI-src (IUPAC-InChI/INCHI, MIT; the
  1.07.5 tree matches the homebrew oracle). Read, never vendored.
- Oracle batteries through the gem's SMILES→molfile path are the
  fastest decoder (see /tmp/qbattery2.rb, /tmp/isobattery.rb
  patterns in the roadmap memory).
- A triage retirement couples to a corpus tag + the engine CI pin
  bump riding the SAME engine PR.
- Both engines gate the same corpus: inchi-rs (full equality) and
  inchi-engine (Ruby, M1/M2 scope) — port every decoded rule to
  both (inchi-engine#20 is the pattern).
