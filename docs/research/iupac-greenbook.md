# IUPAC Green Book audit

Source: *Quantities, Units and Symbols in Physical Chemistry*, 3rd ed.,
RSC Publishing, Cambridge UK, 2007.
https://www.iupac.org/fileadmin/user_upload/publications/e-resources/ONLINE-IUPAC-GB3-2ndPrinting-Online-Sep2012.pdf

Also covers: IUPAC Recommendation, *Pure Appl. Chem.* **90** (2018)
175–180 (nomenclature of inorganic chemistry, section 2 on formulae).

## What the Green Book specifies

The Green Book is the authoritative reference for symbols, quantities,
and units in physical chemistry. Section 2.10 ("Formulae") covers the
typography of chemical formulae.

### Element symbols

- One or two letters, first capitalised.
- Two-letter symbols are getting common beyond element 112 (Uub, Uut,
  ...); the convention is preserved.

### Subscripts (multiplicity)

- Subscripts indicate the number of preceding atoms in a formula.
- Typography: small subscript numerals, no underscore in print. The
  print form is `H₂O`; in plain text, the underscore marker `H_2O` is
  the conventional ASCII spelling.

### Superscripts (charge, isotope, oxidation state)

- **Charge**: right superscript; number-then-sign (e.g. `Ca²⁺`, not
  `Ca⁺²`). Sign alone for unit charges (`Na⁺`, `Cl⁻`).
- **Isotope / mass number**: left superscript (e.g. ¹⁴C).
- **Oxidation state**: right superscript, Roman numerals in parentheses
  (e.g. Fe^(III)).

### Stoichiometric coefficients

- Left of the formula, normal-size numeral (e.g. `2 H₂O`). Not a
  subscript.

### Reaction arrows

- Forward: `→`
- Reverse: `←`
- Equilibrium: `⇌` (harpoons top and bottom)
- Resonance: `↔`
- Conditions are placed above and below the arrow, in smaller type.

### Multi-line formulae

- The Green Book does not standardise skeletal or structural formulae.
  Refer to chemfig audit for that.

## What AsciiChem borrows

| Construct | Green Book | AsciiChem |
|---|---|---|
| Element symbol | `C`, `He` | same |
| Charge order | number-then-sign | `Ca^2+` (canonicalised on round-trip) |
| Isotope position | left superscript | `^14C` (prefix) |
| Oxidation state | parens around Roman | `Fe^(III)` |
| Stoichiometric coefficient | left of formula | `2H_2O` |
| Equilibrium arrow | `⇌` | `<=>` (ASCII); MathML emits `⇌` |

## Where AsciiChem diverges

None. AsciiChem's v1 spelling is a one-to-one ASCII transliteration of
the Green Book. Divergences are deferred until v2 (stereochemistry,
skeletal formulae), where the Green Book is silent and other references
(chemfig) govern.

## What's left to audit

- Section 2.10 also covers condensation notations (e.g. polymer repeat
  units) which AsciiChem does not yet model.
- The 2018 Recommendation adds coordination nomenclature that may need
  additional Group/bracket semantics. Tracked in TODO 13.
