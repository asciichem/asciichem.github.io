# 02 — Scaffold asciichem-ruby gem

- **Priority:** P1 (foundation)
- **Status:** pending
- **Depends on:** nothing
- **Blocks:** 03, 04, 05, 06, 09, 10

## Motivation

Establish the gem skeleton so all later work has a home. Mirror Plurimath's
layout (parser → transform → model → formatters) but as an independent gem.

## Scope

Files to create under `../asciichem-ruby/`:

- `asciichem.gemspec` — name `asciichem`, deps on `parslet`, `plurimath`,
  `thor`, `mml`. Ruby >= 3.2.
- `Gemfile` — references the gemspec, adds `rspec`, `rake`, `rubocop` for
  dev.
- `Rakefile` — `RSpec::Core::RakeTask.new(:spec)`, `Bundler::GemTasks`.
- `README.adoc` — purpose, install, basic usage.
- `CODE_OF_CON.md`, `LICENSE` (BSD-2-Clause, matching Plurimath).
- `lib/asciichem.rb` — `module AsciiChem` with autoloads for `Parser`,
  `Transform`, `Model`, `Formatter`, `Cli`, `Version`, `Error`. Each
  autoload points to a file path under `lib/asciichem/`.
- `lib/asciichem/version.rb` — `VERSION = "0.1.0"`.
- `lib/asciichem/errors.rb` — `class Error < StandardError; end` plus
  `ParseError < Error`.
- `exe/asciichem` — binstub requiring `asciichem/cli`.

Constraints (global CLAUDE.md):

- No `require_relative` for internal code. Use `autoload` declared in the
  immediate parent namespace's file.
- No `instance_variable_set/get`, no `send` to private methods, no
  `respond_to?` type checks.

## Acceptance

- `bundle exec ruby -e "require 'asciichem'; puts AsciiChem::VERSION"`
  prints `0.1.0`.
- `bundle exec rspec` runs with zero examples and exits 0.
- `bundle exec rubocop lib/` passes (or is disabled via `.rubocop.yml`
  with documented reasons).
