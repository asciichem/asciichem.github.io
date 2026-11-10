# 08 — CLI (Thor)

- **Priority:** P2
- **Status:** pending
- **Depends on:** 02, 05, 07
- **Blocks:** site integration scripting

## Motivation

A CLI is how the Astro site's build script will invoke the gem to render
examples. Also useful for ad-hoc conversion during development. Mirror
Plurimath's CLI shape.

## Scope

`lib/asciichem/cli.rb` — `class Cli < Thor`. Commands:

- `convert -i "<text>" -t mathml|text|html|latex|svg` — parse input,
  emit the requested format on stdout.
- `roundtrip -i "<text>"` — parse, emit text, exit non-zero if
  non-equal.
- `version` — print `AsciiChem::VERSION`.

`exe/asciichem` — binstub.

Exit codes: 0 success, 1 parse error, 2 unknown format.

## Acceptance

- `bundle exec exe/asciichem convert -i "H_2O" -t mathml` prints a
  `<math>` document.
- `bundle exec exe/asciichem version` prints `0.1.0`.
- `bundle exec exe/asciichem roundtrip -i "H_2O"` exits 0.
- One spec file exercising the CLI via `Cli.start(%w[...])`.
