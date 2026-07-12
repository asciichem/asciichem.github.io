import { test, expect } from "@playwright/test";

/**
 * Visual regression for every doc page. Baselines are captured on
 * first run via `npx playwright test --update-snapshots` and live at
 * `tests/visual/baselines/`. Subsequent runs diff against the
 * baseline; diffs > threshold fail.
 *
 * To regenerate baselines (e.g. intentional design change):
 *   npx playwright test --update-snapshots
 *   commit the updated PNGs.
 */

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
  "/examples/common-formulae/",
];

for (const page of PAGES) {
  test(`${page} - visual baseline`, async ({ page: browserPage }) => {
    await browserPage.goto(page, { waitUntil: "load" });
    // Hide the theme toggle so dark/light variants don't flap.
    await browserPage.addStyleTag({
      content: `starlight-theme-select { visibility: hidden; }`,
    });
    // Hide the pagefind index badge (random build timestamp).
    await browserPage.addStyleTag({
      content: `[data-pagefind-body] .header-link { visibility: hidden; }`,
    });
    expect(await browserPage.screenshot({ fullPage: true })).toMatchSnapshot(
      `${page.replace(/\//g, "-").replace(/^-|-$/g, "") || "home"}.png`,
      { maxDiffPixelRatio: 0.01 },
    );
  });
}
