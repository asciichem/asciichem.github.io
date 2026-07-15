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

function gemAvailable(): boolean {
  try {
    execFileSync("asciichem", ["version"], { stdio: "ignore", timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

const HAS_GEM = gemAvailable();

function renderMathml(source: string): string | null {
  if (cache.bySource.has(source)) {
    return cache.bySource.get(source)!;
  }
  if (!HAS_GEM) {
    cache.bySource.set(source, "");
    return null;
  }
  try {
    const out = execFileSync(
      "asciichem",
      ["convert", "-i", source, "-t", "mathml"],
      { encoding: "utf-8", timeout: 10_000 },
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
