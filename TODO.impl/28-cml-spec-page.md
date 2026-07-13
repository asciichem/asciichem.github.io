# 28 — CML spec page on the AsciiChem site

- **Priority:** P2 (documentation)
- **Status:** pending
- **Depends on:** 26 (CML round-trip), 27 (canonical chem model)

## Motivation

CML support shipped in TODO 26 and the canonical model landed in
TODO 27. Users need a single, accessible reference for what CML
support covers, how to use it, and where it's limited.

## Scope

A new MDX page at `src/content/docs/reference/cml.mdx`. Contents:

1. **What CML is.** Brief intro; link to the official spec.
2. **Why AsciiChem supports it.** Interoperability, lossless
   persistence, round-trip proof, publication workflows.
3. **Architecture.** The diagram from TODO 27: canonical
   `Chemml::Model` at the hub; AsciiChem text and CML XML as
   adapters.
4. **Model → CML element mapping.** Table showing each
   `Chemml::Model::*` class and the CML element + attributes it
   produces.
5. **Worked examples.** Live ```` ```asciichem ```` blocks alongside
   their CML output, rendered via the existing build-time gem
   integration.
6. **Limitations.** Features CML has that we don't yet model (3D
   coordinates, spectroscopy blocks, polymer notation) and
   vice versa (Lewis markers, stereochemistry — handled via
   `aci:` namespace).
7. **Verifying round-trip.** CLI commands and Ruby snippets.

The page slots into the **Reference** sidebar group, after
`reference/round-trip` and `reference/iupac-mapping`.

## Acceptance criteria

- [ ] Page exists at `src/content/docs/reference/cml.mdx`.
- [ ] Architecture diagram renders correctly.
- [ ] Mapping table covers every public canonical model class.
- [ ] At least 5 worked examples render live.
- [ ] `npm run check:links` reports zero broken links.
- [ ] Sidebar includes the new page in the Reference group.
