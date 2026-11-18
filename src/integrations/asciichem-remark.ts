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
 *   <figure class="asciichem-example not-content">
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

function renderOnce(cli: Cli, source: string): string {
  return execFileSync(
    cli.cmd,
    [...cli.args, "convert", "-i", source, "-t", "mathml"],
    { encoding: "utf-8", timeout: 15_000, cwd: cli.cwd },
  ).trim();
}

function renderMathml(source: string): string | null {
  if (cache.bySource.has(source)) {
    return cache.bySource.get(source)!;
  }
  if (!CLI) {
    cache.bySource.set(source, "");
    return null;
  }
  // One retry: each call boots Ruby, and under parallel page builds a
  // call can transiently blow the timeout. A cached failure would
  // punch a permanent "install the gem" hole into a deployed page.
  let out: string | null = null;
  let err: unknown;
  for (let attempt = 0; attempt < 2 && out === null; attempt++) {
    try {
      out = renderOnce(CLI, source);
    } catch (e) {
      err = e;
    }
  }
  if (out === null) {
    console.warn(`[asciichem] render failed for ${JSON.stringify(source)}:`, err);
    cache.bySource.set(source, "");
    return null;
  }
  cache.bySource.set(source, out);
  return out;
}

function buildFigure(source: string): string {
  // Per-line first: a multi-line block is normally one example per
  // line, and rendering the whole block in one shot would concatenate
  // every formula into a single <math> run-on row (H₂H₂OH₂SO₄…). The
  // grammar accepts several formulas as one document, so a successful
  // whole-block parse proves nothing about intent. Only when some line
  // is not a standalone formula do we fall back to the whole block —
  // that's the genuinely-one-expression case (spectrum{...},
  // mechanism{...}, calc{...}, z-matrices).
  const lines = source.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length > 1) {
    const mathmls = lines.map((line) => renderMathml(line.trim()));
    if (mathmls.every((m) => Boolean(m))) {
      const items = mathmls
        .map((mathml, i) => buildItemFromMathml(lines[i].trim(), mathml!))
        .join("\n  ");
      return `<figure class="asciichem-example not-content">
  <div class="asciichem-example-header">
    <span class="asciichem-label">Source</span>
    <span class="asciichem-label">Rendered</span>
  </div>
  ${items}
</figure>`;
    }
  }
  const whole = renderMathml(source.trim());
  if (whole !== null) {
    return `<figure class="asciichem-example not-content">
  <div class="asciichem-example-header">
    <span class="asciichem-label">Source</span>
    <span class="asciichem-label">Rendered</span>
  </div>
  ${buildItem(source.trim())}
</figure>`;
  }
  const items = lines.map((line) => buildItem(line)).join("\n  ");
  return `<figure class="asciichem-example not-content">
  <div class="asciichem-example-header">
    <span class="asciichem-label">Source</span>
    <span class="asciichem-label">Rendered</span>
  </div>
  ${items}
</figure>`;
}

function buildItem(source: string): string {
  const mathml = renderMathml(source);
  return buildItemFromMathml(source, mathml);
}

function buildItemFromMathml(source: string, mathml: string | null): string {
  const render = mathml
    ? `<div class="asciichem-render">${mathml}</div>`
    : `<div class="asciichem-render asciichem-render--missing">
         <em>Install the <code>asciichem</code> gem to see this rendered.</em>
       </div>`;
  // tabindex="0" on the source pane: it scrolls horizontally, and
  // keyboard users must be able to reach a scrollable region
  // (WCAG 2.1.1 / axe `scrollable-region-focusable`).
  return `<div class="asciichem-item">
    <div class="asciichem-source" tabindex="0"><code class="language-asciichem">${escapeHtml(source)}</code></div>
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
