import { defineConfig } from "@playwright/test";

/**
 * Playwright config for the AsciiChem site.
 *
 * - Visual regression snapshots in `tests/visual/baselines/`.
 * - a11y audit runs via `scripts/accessibility-audit.mjs` against the
 *   same preview URL.
 *
 * Run a local preview first:
 *   npm run preview &
 * then:
 *   npx playwright test            # run all tests
 *   npx playwright test --update-snapshots   # capture / refresh baselines
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.ts$/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.PREVIEW_URL ?? "http://localhost:4321",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop-light",
      use: {
        viewport: { width: 1280, height: 720 },
        colorScheme: "light",
      },
    },
    {
      name: "desktop-dark",
      use: {
        viewport: { width: 1280, height: 720 },
        colorScheme: "dark",
      },
    },
    {
      name: "mobile-light",
      use: {
        viewport: { width: 375, height: 667 },
        colorScheme: "light",
      },
    },
  ],
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
