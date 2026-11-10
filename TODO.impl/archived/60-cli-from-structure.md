# 60 — CLI: --from smiles|molfile on convert

- **Priority:** P2
- **Status:** done — gem #57/#58 (0.22.0)
- **Repo:** asciichem-ruby
- **Source:** TODO.v2 09 leftover scope

## What

`asciichem convert -i <input> --from asciichem|smiles|molfile`
selects the ingestion grammar; `-t` gains `structural-svg` and
`model-json` targets so ingested structures can render or serialize
straight from the CLI. Molfile input may be a file path (multiline).
Tests cover each combination and the error surfaces.
