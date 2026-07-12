# chemfig audit

Source: `chemfig` LaTeX package by Christian Tellechea.
https://ctan.org/pkg/chemfig

`chemfig` is the LaTeX package for **structural** formulae — skeletal
representations, ring structures, stereochemistry, reaction schemes.
Where mhchem handles formula-level typography, chemfig handles
two-dimensional structural drawing.

## What chemfig provides

### Bond syntax

Inside `\chemfig{...}`:

```latex
\chemfig{A-B}        % single bond
\chemfig{A=B}        % double bond
\chemfig{A~B}        % triple bond (chemfig uses ~, not #)
```

Bonds are directional. The default is rightward; angles can be specified:

```latex
\chemfig{A-[::30]B-[:90]C}
```

`::30` is relative angle; `:90` is absolute. This lets you draw rings
and zig-zags.

### Ring syntax

```latex
\chemfig{*6(-=-=-=-=)}    % benzene ring (6-membered, alternating bonds)
\chemfig{**5(-----)}      % cyclopentadienyl (5-membered, all single)
```

### Stereo bonds

```latex
\chemfig{A-[::-20]B}      % wedge bond
\chemfig{A-[:::20]B}      % hash bond
```

chemfig draws wedge/hash bonds via TikZ.

### Branches and substitution

```latex
\chemfig{A(-B(-C)-D)-E}
```

Parenthesised branches off the main chain.

### Embedded chemistry

chemfig integrates with mhchem:

```latex
\chemfig{\ce{CH3}-\ce{CH2}-\ce{OH}}
```

## What AsciiChem borrows (v1)

For linear notation (single-line formulae with explicit bonds), AsciiChem
borrows `-`, `=`, `#`:

```asciichem
H-O-H
H_2C=CH_2
HC#CH
```

The `#` is AsciiChem's choice; chemfig uses `~`. We chose `#` because
`~` is overloaded in many contexts (URLs, file paths).

## What AsciiChem defers

### Two-dimensional layout

chemfig's main power is two-dimensional layout via angles. AsciiChem
v1 is one-dimensional. Delegated to `mn/elk-rb` for SVG rendering when
2D layout is needed.

Tracked in TODO 13 / TODO 07 (SVG formatter).

### Ring syntax

chemfig's `*6(-=-=-=-=)` shorthand for benzene has no v1 AsciiChem
equivalent. v2 will need a ring construct; likely `ring(6, -=-=-=)` or
similar.

### Branching

chemfig's parenthesised branches work for trees. AsciiChem v1
parentheses are groups (sequential). Branches need a different syntax;
deferred.

### Stereo bonds

The wedge/hash markers in AsciiChem's `Bond` model (`>-`, `-<`) are
placeholders. Without 2D context they don't render meaningfully.
Implementation deferred to the SVG formatter.

## Why chemfig cannot be lifted verbatim

chemfig is LaTeX-internal. Its syntax uses backslashes (`\chemfig`,
`\ce`, `\branch`) and TikZ primitives. AsciiChem's constraint is plain
keyboard ASCII without backslashes. The conceptual model — bonds as
typed relationships between nodes — is borrowed; the syntax is not.

## What's left to audit

- chemfig's reaction scheme support (`\schemestart ... \schemestop`)
  for multi-step reactions. AsciiChem v2 needs this for cascades.
- chemfig's Lewis structure support (lone pairs, radicals as markup).
  AsciiChem v2 will likely need a `Marker` model.
