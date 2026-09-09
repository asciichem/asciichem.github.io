# 52 — Non-deterministic spec-suite truncation (pre-existing)

- **Priority:** P1 (blocks trustworthy CI signal for everything else)
- **Status:** pending (diagnosed 2026-09-09; root cause not yet fixed)
- **Depends on:** nothing
- **Discovered during:** 35

## Symptom

`bundle exec rake spec` (and direct full `bundle exec rspec`) terminate
early with **randomly truncated example counts** while reporting
"0 failures", exiting non-zero (occasionally zero). Observed counts on
consecutive identical invocations:

- With the v2 identifier work: 748 / 538 / 292 / 89 / 56.
- On **pristine main** (all v2 changes stashed): 571 / 228 / 105 —
  **pre-existing, not caused by the identifier work.**
- `--dry-run` (collection only) is **stable at 788 examples** every
  time — the example set is fixed; execution aborts mid-run.

## Evidence and suspects

1. **Orphan rspec processes.** Two rspec masters from a previous
   session (Saturday, PIDs 44485 / 44343, parented by a claude shell
   snapshot) are still alive and idle. Candidate interference via the
   shared `spec/examples.txt` (example_status_persistence) or stale
   locks. `spec/examples.txt` was moved aside during diagnosis
   (backup at `/tmp/asciichem-examples-backup.txt`); the file is
   gitignored and auto-regenerated. **Truncation persisted without
   it**, so it is not sufficient cause — but the orphans remain
   suspects (kill only with user confirmation).
2. **`Kernel#exit` mid-example.** `lib/asciichem/cli.rb` calls
   `exit 0/1/2`. A spec reaching an `exit` under random ordering
   raises `SystemExit`, which aborts the run cleanly with a partial
   summary — matching the truncated-count + "0 failures" + non-zero
   exit signature exactly. Random order (`config.order = :random`,
   new seed per run) explains the variance. Check whether cli specs
   guard against `exit` (e.g. `expect { ... }.to raise_error
   (SystemExit)`) in all paths, and whether any non-CLI spec can
   reach an exit.
3. Examples.txt clobbering (ruled insufficient — see 1).

## Scope

- Reproduce with a fixed seed (`--seed N`) until truncated, then
  bisect (`rspec --bisect`) to the aborting example.
- Fix the root cause (guard the `exit`, or remove the orphans, or
  both).
- Optional hardening: fail the suite if the executed example count
  differs from the collected count.

## Acceptance

- ≥ 3 consecutive full runs execute all 788 examples (count stable),
  exit 0, on the working tree including the v2 identifier work.
