#!/usr/bin/env node
/**
 * Validate internal links in the built site. Crawls dist/*.html and
 * asserts every internal href points to a file that exists.
 *
 * Run after `npm run build`:
 *   node scripts/validate-links.mjs
 *
 * Exits non-zero if any link is broken.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "..", "dist");

/** Collect all .html files under DIST. */
async function htmlFiles(dir = DIST) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory() ? htmlFiles(path) : path;
    }),
  );
  return files.flat().filter((f) => extname(f) === ".html");
}

/** Extract href values from <a> tags in an HTML file. */
function extractLinks(html) {
  const links = new Set();
  const re = /<a[^>]+href="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    links.add(m[1]);
  }
  return [...links];
}

/** Resolve a link target against the current file, return absolute path. */
function resolveTarget(from, href) {
  if (href.startsWith("#")) return null;
  if (/^[a-z]+:/.test(href)) return null; // external
  if (href.startsWith("mailto:")) return null;

  const [path, hash] = href.split("#");
  const base = dirname(from);
  // Absolute paths resolve from DIST; relative paths from the current
  // file's directory.
  const start = path.startsWith("/") ? DIST : base;
  const resolved = path
    ? resolve(start, path.replace(/^\//, ""))
    : from;

  let target = resolved;
  if (extname(target) === "") {
    // Directory-style link: try index.html
    target = join(target, "index.html");
  }

  return { path: target, hash };
}

async function main() {
  const files = await htmlFiles();
  const existing = new Set(files);

  const broken = [];
  for (const file of files) {
    const html = await readFile(file, "utf-8");
    for (const href of extractLinks(html)) {
      const target = resolveTarget(file, href);
      if (!target) continue;
      if (!existing.has(target.path)) {
        // Allow anchors into the same page
        if (!existing.has(target.path.replace(/index\.html$/, ""))) {
          broken.push({ from: file, href, target: target.path });
        }
      }
    }
  }

  if (broken.length === 0) {
    console.log(`[validate-links] OK — all internal links resolve.`);
    return;
  }

  console.error(`[validate-links] ${broken.length} broken link(s):`);
  for (const { from, href, target } of broken) {
    console.error(`  ${from.replace(DIST, "")} -> ${href} (missing ${target.replace(DIST, "")})`);
  }
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
