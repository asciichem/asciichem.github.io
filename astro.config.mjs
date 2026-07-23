// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { remarkAsciiChem } from "./src/integrations/asciichem-remark.ts";

// Site config — https://www.asciichem.org
// Deploy target is GitHub Pages from this repo (asciichem.github.io).
export default defineConfig({
  site: "https://www.asciichem.org",
  output: "static",
  trailingSlash: "ignore",
  markdown: {
    remarkPlugins: [remarkAsciiChem],
  },
  integrations: [
    starlight({
      title: "AsciiChem",
      description:
        "An ASCII syntax for representing chemistry: atoms, molecules, bonds, reactions, electron configurations, and embedded mathematics.",
      logo: {
        src: "./src/assets/logo-light.svg",
        dark: "./src/assets/logo-dark.svg",
        replacesTitle: false,
      },
      head: [
        {
          tag: "link",
          attrs: {
            rel: "icon",
            type: "image/png",
            href: "/favicon-96x96.png?v=20260723",
            sizes: "96x96",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            type: "image/svg+xml",
            href: "/favicon.svg?v=20260723",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "shortcut icon",
            href: "/favicon.ico?v=20260723",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "apple-touch-icon",
            sizes: "180x180",
            href: "/apple-touch-icon.png?v=20260723",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "manifest",
            href: "/site.webmanifest?v=20260723",
          },
        },
      ],
      pagefind: true,
      social: [
        {
          label: "GitHub",
          href: "https://github.com/asciichem/asciichem-ruby",
          icon: "github",
        },
      ],
      components: {
        Header: "./src/components/Header.astro",
        Footer: "./src/components/Footer.astro",
        ThemeSelect: "./src/components/ThemeToggle.astro",
        SiteTitle: "./src/components/SiteTitle.astro",
      },
      sidebar: [
        {
          label: "Guides",
          items: [
            { label: "Getting started", slug: "guides/getting-started" },
            { label: "Why AsciiChem?", slug: "guides/why-asciichem" },
            { label: "What's new in v0.2", slug: "guides/whats-new" },
          ],
        },
        {
          label: "Syntax",
          items: [
            { label: "Overview", slug: "syntax" },
            { label: "Atoms", slug: "syntax/atoms" },
            { label: "Molecules", slug: "syntax/molecules" },
            { label: "Bonds", slug: "syntax/bonds" },
            { label: "Reactions", slug: "syntax/reactions" },
            { label: "Stereochemistry", slug: "syntax/stereochemistry" },
            { label: "Coordinates", slug: "syntax/coordinates" },
            { label: "Ring closures", slug: "syntax/ring-closures" },
            { label: "Annotations", slug: "syntax/annotations" },
            { label: "Electron configurations", slug: "syntax/electron-config" },
            { label: "Embedded math", slug: "syntax/embedded-math" },
            { label: "Crystallography", slug: "syntax/crystallography" },
            { label: "Spectroscopy", slug: "syntax/spectroscopy" },
            { label: "Computational chemistry", slug: "syntax/calculation" },
            { label: "Z-Matrix", slug: "syntax/zmatrix" },
            { label: "Reaction mechanisms", slug: "syntax/mechanism" },
          ],
        },
        {
          label: "Model",
          items: [
            { label: "Overview", slug: "model" },
            { label: "Formula", slug: "model/formula" },
            { label: "Atom", slug: "model/atom" },
            { label: "Molecule", slug: "model/molecule" },
            { label: "Group", slug: "model/group" },
            { label: "Bond", slug: "model/bond" },
            { label: "Reaction", slug: "model/reaction" },
            { label: "ReactionCascade", slug: "model/reaction-cascade" },
            { label: "ElectronConfiguration", slug: "model/electron-configuration" },
            { label: "EmbeddedMath", slug: "model/embedded-math" },
            { label: "Text", slug: "model/text" },
            { label: "Crystal", slug: "model/crystal" },
            { label: "Spectrum", slug: "model/spectrum" },
            { label: "Calculation", slug: "model/calculation" },
            { label: "ZMatrix", slug: "model/zmatrix" },
            { label: "Mechanism", slug: "model/mechanism" },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "Cheat sheet", slug: "reference/cheatsheet" },
            { label: "Ruby API", slug: "reference/api" },
            { label: "CLI", slug: "reference/cli" },
            { label: "Output formats", slug: "reference/formats" },
            { label: "Linter", slug: "reference/linter" },
            { label: "CML round-trip", slug: "reference/cml" },
            { label: "Round-trip conformance", slug: "reference/round-trip" },
            { label: "IUPAC mapping", slug: "reference/iupac-mapping" },
          ],
        },
        {
          label: "Examples",
          items: [{ autogenerate: { directory: "examples" } }],
        },
        {
          label: "Project",
          items: [
            { label: "About", slug: "about" },
            { label: "Playground", slug: "playground" },
            { label: "News", slug: "news" },
          ],
        },
      ],
      customCss: ["./src/styles/app.css"],
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
