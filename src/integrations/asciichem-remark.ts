/**
 * Remark plugin: replaces fenced code blocks tagged `asciichem` with a
 * rendered figure showing the source and its MathML output.
 *
 * The MathML is produced at build time by shelling out to the
 * `asciichem` CLI. The plugin caches results in-memory for the
 * duration of the build.
 *
 * Usage in MDX:
 *
 *   ```asciichem
 *   H_2O
 *   ```
 *
 * Renders as:
 *
 *   <figure class="asciichem-example">
 *     <pre><code>H_2O</code></pre>
 *     <div class="asciichem-render"><math>...</math></div>
 *   </figure>
 *
 * If the gem is unavailable (e.g. local dev without `bundle install`),
 * the plugin degrades gracefully and renders just the source.
 */
import type { Plugin } from "unified";
import type { Root, Code, Html } from "mdast";
import { visit } from "unist-util-visit";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { escapeHtml } from "../lib/escape.ts";

interface RenderCache {
  bySource: Map<string, string>;
}

function makeCache(): RenderCache {
  return { bySource: new Map() };
}

const globalForCache = globalThis as unknown as { __asciichemCache?: RenderCache };
const cache: RenderCache = globalForCache.__asciichemCache ?? makeCache();
if (!globalForCache.__asciichemCache) {
  globalForCache.__asciichemCache = cache;
}

interface Cli {
  cmd: string;
  args: string[];
  cwd?: string;
}

// Prefer the sibling reference implementation (../asciichem-ruby) so
// local builds render with the sibling's current code — unreleased
// syntax shows up immediately. CI installs the gem from the same repo
// and resolves it on PATH.
function resolveCli(): Cli | null {
  const sibling = resolve(process.cwd(), "..", "asciichem-ruby");
  const siblingExe = join(sibling, "exe", "asciichem");
  if (existsSync(siblingExe)) {
    try {
      execFileSync("bundle", ["exec", "./exe/asciichem", "version"], {
        cwd: sibling,
        stdio: "ignore",
        timeout: 10_000,
      });
      return { cmd: "bundle", args: ["exec", "./exe/asciichem"], cwd: sibling };
    } catch {
      // sibling exists but is not bundled — fall through to PATH
    }
  }
  try {
    execFileSync("asciichem", ["version"], { stdio: "ignore", timeout: 5000 });
    return { cmd: "asciichem", args: [] };
  } catch {
    return null;
  }
}

const CLI = resolveCli();

function renderMathml(source: string): string | null {
  if (cache.bySource.has(source)) {
    return cache.bySource.get(source)!;
  }
  if (!CLI) {
    cache.bySource.set(source, "");
    return null;
  }
  try {
    const out = execFileSync(
      CLI.cmd,
      [...CLI.args, "convert", "-i", source, "-t", "mathml"],
      { encoding: "utf-8", timeout: 15_000, cwd: CLI.cwd },
    ).trim();
    cache.bySource.set(source, out);
    return out;
  } catch (err) {
    console.warn(`[asciichem] render failed for ${JSON.stringify(source)}:`, err);
    cache.bySource.set(source, "");
    return null;
  }
}

function buildFigure(source: string): string {
  // Whole-block first: multi-line constructs (spectrum{...},
  // mechanism{...}, calc{...}, z-matrices) are one expression; their
  // body lines are not standalone formulas and must not be parsed as
  // such. Falls back to per-line rendering (the common case: one
  // example per line).
  const whole = renderMathml(source.trim());
  if (whole !== null) {
    return `<figure class="asciichem-example">
  <div class="asciichem-example-header">
    <span class="asciichem-label">Source</span>
    <span class="asciichem-label">Rendered</span>
  </div>
  ${buildItem(source.trim())}
</figure>`;
  }
  const lines = source.split(/\r?\n/).filter((l) => l.length > 0);
  const items = lines.map((line) => buildItem(line)).join("\n  ");
  return `<figure class="asciichem-example">
  <div class="asciichem-example-header">
    <span class="asciichem-label">Source</span>
    <span class="asciichem-label">Rendered</span>
  </div>
  ${items}
</figure>`;
}

function buildItem(source: string): string {
  const mathml = renderMathml(source);
  const render = mathml
    ? `<div class="asciichem-render">${mathml}</div>`
    : `<div class="asciichem-render asciichem-render--missing">
         <em>Install the <code>asciichem</code> gem to see this rendered.</em>
       </div>`;
  return `<div class="asciichem-item">
    <div class="asciichem-source"><code class="language-asciichem">${escapeHtml(source)}</code></div>
    ${render}
  </div>`;
}

export const remarkAsciiChem: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "code", (node: Code, index, parent) => {
      if (node.lang !== "asciichem" || !parent || typeof index !== "number") {
        return;
      }
      const figure: Html = {
        type: "html",
        value: buildFigure(node.value),
      };
      parent.children[index] = figure;
    });
  };
};
