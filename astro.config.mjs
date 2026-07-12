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
        src: "./src/assets/logo.svg",
        replacesTitle: false,
      },
      social: [
        {
          label: "GitHub",
          href: "https://github.com/asciichem/asciichem-ruby",
          icon: "github",
        },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            { label: "Getting started", slug: "guides/getting-started" },
            { label: "Why AsciiChem?", slug: "guides/why-asciichem" },
          ],
        },
        {
          label: "Syntax",
          items: [{ autogenerate: { directory: "syntax" } }],
        },
        {
          label: "Reference",
          items: [{ autogenerate: { directory: "reference" } }],
        },
        {
          label: "Examples",
          items: [{ autogenerate: { directory: "examples" } }],
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
