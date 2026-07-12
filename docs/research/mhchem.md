# mhchem audit

Source: `mhchem` LaTeX package by Martin Hensel.
https://ctan.org/pkg/mhchem

`mhchem` is the most widely used LaTeX package for chemistry formulae.
It provides a `\ce{...}` macro that typesets chemistry with a syntax
close to what chemists naturally type.

## What mhchem provides

### Implicit subscripts

Inside `\ce{...}`, digits immediately after an element are treated as
subscripts:

```latex
\ce{H2O}        % → H₂O
\ce{C6H12O6}    % → C₆H₁₂O₆
\ce{Ca(OH)2}    % → Ca(OH)₂
```

No underscore needed. mhchem parses element symbols and treats the
trailing digits as multiplicity.

### Charges

```latex
\ce{Ca^{2+}}    % → Ca²⁺
\ce{SO4^{2-}}   % → SO₄²⁻
\ce{Ag+ + Cl- -> AgCl v}
```

Braces optional for single character charges.

### Isotopes

```latex
\ce{^{14}C}     % → ¹⁴C
\ce{^{227}_{90}Th} % → mass number AND atomic number
```

mhchem allows both left-superscript (mass number) and left-subscript
(atomic number). AsciiChem v1 supports only mass number; atomic number
prefix is deferred.

### Reaction arrows

```latex
\ce{A -> B}        % forward
\ce{A <- B}        % reverse
\ce{A <=> B}       % equilibrium
\ce{A <-> B}       % resonance / mesomerism
```

Same set as AsciiChem.

### Conditions

```latex
\ce{A <=>[catalyst][temp] B}
```

First bracket pair above, second below. Direct lift into AsciiChem.

### Bonds

mhchem does not draw structural bonds. It supports a few textual
shorthands:

```latex
\ce{A - B}        % hyphen (single, but ambiguous with subtraction)
\ce{A = B}        % equals (double)
```

For real structural formulae, mhchem defers to `chemfig`.

### Adducts, reaction cascades, etc.

```latex
\ce{A·B}          % adduct (middle dot)
\ce{A ->[above] B ->[above] C}   % cascade
```

Adducts and cascades are deferred to AsciiChem v2.

## What AsciiChem borrows

| mhchem | AsciiChem |
|---|---|
| `\ce{H2O}` | `H_2O` (explicit `_`) |
| `\ce{^{14}C}` | `^14C` |
| `\ce{Ca^{2+}}` | `Ca^2+` |
| `\ce{A -> B}` | `A -> B` |
| `\ce{A <=>[Fe][T] B}` | `A <=>[Fe][T] B` |

## Where AsciiChem diverges

### Implicit subscripts

mhchem uses implicit subscripts (`H2O`). AsciiChem uses explicit
(`H_2O`). Reasons:

1. **Disambiguation.** `H2O` could parse as `H`, `2`, `O` (math-style)
   or as `H` with multiplicity 2 followed by `O`. The explicit `_`
   makes the chemistry intent unambiguous.
2. **Round-trip clarity.** `H_2O` is the canonical form. mhchem's
   implicit form canonicalises to `\ce{H2O}`, but only inside `\ce{}`;
   outside, `H2O` is plain text.
3. **Math escape simplicity.** Without implicit subscripts, AsciiChem
   doesn't need a special "chemistry mode" toggle — the syntax is
   self-delimiting.

The trade-off: mhchem users must add `_` to convert. Documented in the
[atoms](/syntax/atoms/) page.

### Backslash commands

AsciiChem has no backslash commands. Constructs are positional
(prefix/suffix markers). This keeps the syntax ASCII-friendly without
needing LaTeX.

## What's left to audit

- mhchem's `\cf` (low-level form) exposes more primitives; not needed
  for AsciiChem v1.
- mhchem has special handling for Greek letters in conditions (`\alpha`,
  `\beta`). AsciiChem allows them as text runs.
