# 10 — Build-time gem integration (render AsciiChem in MDX)

- **Priority:** P1
- **Status:** pending
- **Depends on:** 08 (CLI), 09
- **Blocks:** 11

## Motivation

Every spec example on the site should show: the AsciiChem source, its
MathML rendering, and (where relevant) the SVG rendering. Doing this by
hand drifts from the gem. Doing it at build time, via the gem, guarantees
the site and the gem agree.

## Scope

- `src/components/AsciiChemExample.astro` — receives `code` (the
  AsciiChem source string) and `format` (mathml | svg | text | html).
  At build time, invokes `npx asciichem convert -i "<code>" -t <format>`
  via Astro's `Astro.locals` / a Vite import. Caches output to
  `.asciichem-cache/<hash>.txt` so incremental builds are fast.

  Renders into a styled `<figure>`:
  - source code block (with the AsciiChem syntax)
  - rendered output (MathML inline; SVG as inline XML; etc.)

- A remark/rehype plugin (`src/integrations/asciichem-mdx.ts`) — scans
  MDX for fenced code blocks tagged `asciichem` and replaces them with
  the `<AsciiChemExample>` component. Authors write:

  ````mdx
  ```asciichem
  H_2O
  ```
  ````

  and the site renders source + MathML together.

- The gem is invoked via `bundle exec asciichem` (not `npx`). Site's
  `package.json` scripts include a `prebuild` hook that runs `bundle
  install` in `../asciichem-ruby` to ensure the gem is current.

## Acceptance

- Authoring a fenced `asciichem` block in any MDX page renders source +
  MathML on the built page.
- Changing the gem and rebuilding picks up the new rendering (cache
  invalidated by source hash).
- One MDX page with three example blocks renders correctly.
