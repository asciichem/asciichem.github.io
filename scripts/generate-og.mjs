#!/usr/bin/env node
/**
 * Generate OpenGraph images for each doc page. Uses `satori` to render
 * HTML/CSS to SVG and `sharp` to convert to PNG.
 *
 * Output: public/og/<slug>.png
 *
 * Pages without explicit OG images reference these by slug in their
 * <head>. The astro.config.mjs `site` value is used to build URLs.
 */
import { mkdir, writeFile, readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import satori from "satori";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DOCS = join(ROOT, "src", "content", "docs");
const OUT = join(ROOT, "public", "og");

const WIDTH = 1200;
const HEIGHT = 630;

/** Collect frontmatter title from each .mdx file. */
async function collectPages() {
  const pages = [];

  async function walk(dir, slug = "") {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full, slug + "/" + entry.name);
      } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
        const isIndex = entry.name === "index.mdx" || entry.name === "index.md";
        const pageSlug = isIndex ? slug : slug + "/" + entry.name.replace(/\.(mdx|md)$/, "");
        const content = await readFile(full, "utf-8");
        const match = content.match(/^title:\s*(.+)$/m);
        const title = match ? match[1].replace(/^["']|["']$/g, "") : "AsciiChem";
        pages.push({ slug: pageSlug.replace(/^\//, ""), title });
      }
    }
  }

  await walk(DOCS);
  return pages;
}

async function loadFont() {
  // Try several font paths. Satori needs a single OpenType font buffer
  // (.ttf / .otf / .woff), not a collection (.ttc).
  const candidates = [
    // @fontsource woff (preferred)
    ["@fontsource", "hanken-grotesk", "files", "hanken-grotesk-latin-700-normal.woff"],
    // System TTFs on macOS
    "/System/Library/Fonts/Helvetica.ttc",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
  ].map((c) => (Array.isArray(c) ? join(ROOT, "node_modules", ...c) : c));

  for (const candidate of candidates) {
    try {
      const buf = await readFile(candidate);
      // Skip .ttc collections — satori can't parse them.
      const sig = buf.slice(0, 4).toString("ascii");
      if (sig === "ttcf" || sig === "OTTO" || sig === "true") {
        if (sig === "ttcf") continue;
      }
      return buf;
    } catch {
      // try next
    }
  }
  return null;
}

async function renderOg(page, font) {
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0c4a3e 0%, #1a6e5a 100%)",
          color: "white",
          padding: "80px",
          fontFamily: "Hanken Grotesk, sans-serif",
        },
        children: [
          {
            type: "div",
            props: {
              style: { fontSize: "32px", opacity: 0.7, marginBottom: "20px" },
              children: "AsciiChem",
            },
          },
          {
            type: "div",
            props: {
              style: { fontSize: "72px", fontWeight: 700, lineHeight: 1.1 },
              children: page.title,
            },
          },
          {
            type: "div",
            props: {
              style: { fontSize: "24px", opacity: 0.8, marginTop: "auto" },
              children: "www.asciichem.org",
            },
          },
        ],
      },
    },
    { width: WIDTH, height: HEIGHT, fonts: font ? [{ name: "Hanken Grotesk", data: font, weight: 700, style: "normal" }] : [] },
  );
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const pages = await collectPages();
  const font = await loadFont();

  if (!font) {
    console.warn("[generate-og] no usable font found; skipping OG image generation.");
    console.warn("                 Install @fontsource/hanken-grotesk or place a .ttf in fonts/.");
    return;
  }

  let count = 0;
  for (const page of pages) {
    const png = await renderOg(page, font);
    const filename = page.slug === "" ? "home" : page.slug.replace(/\//g, "-");
    await writeFile(join(OUT, `${filename}.png`), png);
    count++;
  }

  console.log(`[generate-og] ${count} OG image(s) written to public/og/`);
}

main().catch((err) => {
  console.error("[generate-og] failed:", err);
  process.exit(1);
});
