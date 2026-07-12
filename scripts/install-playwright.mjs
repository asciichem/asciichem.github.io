/**
 * Adds the visual-regression and a11y scripts to package.json.
 * Run after `npm install` to make sure Playwright browsers are
 * available.
 */
import { execSync } from "node:child_process";

console.log("[setup] Installing Playwright browser binaries...");
try {
  execSync("npx playwright install chromium", { stdio: "inherit" });
  console.log("[setup] Done.");
} catch (err) {
  console.error("[setup] Failed. Install manually with:");
  console.error("       npx playwright install chromium");
  process.exit(1);
}
