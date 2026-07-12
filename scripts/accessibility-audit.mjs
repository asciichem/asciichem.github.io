#!/usr/bin/env node
/**
 * Accessibility audit using axe-core against the locally built site.
 * Requires `npm run preview` to be running (or a static server on
 * $PREVIEW_URL).
 *
 *   PREVIEW_URL=http://localhost:4321 node scripts/accessibility-audit.mjs
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const URL = process.env.PREVIEW_URL ?? "http://localhost:4321";

const PAGES = [
  "/",
  "/guides/getting-started/",
  "/guides/why-asciichem/",
  "/syntax/atoms/",
  "/syntax/molecules/",
  "/syntax/reactions/",
  "/syntax/electron-config/",
  "/syntax/embedded-math/",
  "/reference/round-trip/",
  "/reference/iupac-mapping/",
  "/examples/",
];

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const violations = [];

  for (const path of PAGES) {
    const url = URL + path.replace(/^\//, "");
    await page.goto(url, { waitUntil: "load" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    if (results.violations.length > 0) {
      violations.push({ path, count: results.violations.length, details: results.violations });
    }
    console.log(`[a11y] ${path} — ${results.violations.length} violation(s)`);
  }

  await browser.close();

  if (violations.length === 0) {
    console.log("[a11y] OK — all pages pass WCAG 2 AA.");
    return;
  }

  const total = violations.reduce((sum, v) => sum + v.count, 0);
  console.error(`[a11y] ${total} violation(s) across ${violations.length} page(s):`);
  for (const { path, details } of violations) {
    console.error(`  ${path}:`);
    for (const v of details) {
      console.error(`    ${v.id} (${v.help}): ${v.nodes.length} element(s)`);
    }
  }
  process.exit(1);
}

main().catch((err) => {
  console.error("[a11y] failed:", err);
  process.exit(2);
});
