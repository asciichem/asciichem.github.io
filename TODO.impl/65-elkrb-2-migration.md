# 65 — elkrb 2.0 migration (layout engine major)

- **Priority:** P3
- **Status:** done (2026-10-19 — asciichem-ruby#98 MERGED: single
  `Elkrb.layout(graph, algorithm:)` seam, floor `~> 2.0`, full suite
  2024/0 both engines, SVG goldens byte-identical; elkrb 2.0 released)
- **Repo:** asciichem-ruby
- **Source:** latest-pins audit (dependent-library update round)

## What

elkrb released 2.0.0; the gemspec stays at `~> 1.0` because the
2.0 layout API breaks the StructuralSvg/Layout stack: raising the
floor and running the suite produces 37 failures (2024-example
suite, both parse engines otherwise green at the latest stack —
lutaml-model 0.8.114, moxml 0.5.146 with the #398 XPath fix,
mml 2.4.3, plurimath 0.11.9, relaton-bib 2.1.9).

Migration = adapt `lib/asciichem/layout.rb` (GraphBuilder /
ResultExtractor seams) to the elkrb 2.0 API, then raise the floor
pessimistically and re-pin. The L2 structural-SVG goldens are the
byte-exact contract during migration.

## Evidence

`bundle update elkrb` at elkrb `~> 2.0`: 2024 examples, 37
failures, all layout/SVG-path; reverted to `~> 1.0` (1.0.2, green).
