# 51 — Interactive playground

- **Priority:** P3
- **Status:** pending (blocked on 46 reaching L2)
- **Implements:** TODO.v2 12

## Motivation

A client-side playground (type AsciiChem, see live parse + render) is
the fastest syntax teacher and the most visible demo of the three-way
thesis. Ships only at the TS API's CI-verified conformance level —
the playground can never display a wrong parse.

## Scope

- `/playground` route, Vue island (`client:load`): editor + render
  panes (Text/MathML/HTML tabs), corpus-contract error display,
  identifier-annotation validation status, URL-fragment sharing
  (`#code=…`), "try an example" chips from corpus `showcase` tags.
- Zero-JS elsewhere preserved; a11y + visual regression per Primmel
  conventions; no build-time gem on this route.
- Phase 2 (separate PR): client-side structural SVG via WASM (TODO.v2
  11) or TS layout port — decision recorded when 46 matures.

## Acceptance

- Showcase cases render identically to goldens; URL round-trips;
  invalid input shows the corpus-contract error; axe + visual
  regression green; other routes unaffected.
