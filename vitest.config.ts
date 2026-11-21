import { defineConfig } from "vitest/config";

// The unit specs (tests/*.test.ts). The Playwright visual specs
// (tests/visual.spec.ts, tests/visual/) load @playwright/test and are
// vitest's default glob would sweep them in — they run via
// `npm run test:visual` under Playwright's own runner.
export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/visual.spec.ts", "tests/visual/**", "node_modules/**"],
  },
});
