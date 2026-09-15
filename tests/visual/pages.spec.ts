import { test, expect } from "@playwright/test";

// The site's signature surfaces, in reading order: the three-pane
// LiveDiff hero, the conformance matrix, the playground, and the
// per-language implementation pages.

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => document.fonts.ready);
});

test.describe("homepage", () => {
  test("LiveDiff hero with three parity panes", async ({ page }) => {
    await page.goto("/");
    const diff = page.locator(".live-diff");
    await expect(diff).toBeVisible();
    await expect(diff.locator(".ld-pane", { hasText: "Ruby" })).toBeVisible();
    await expect(diff.locator(".ld-pane", { hasText: "TypeScript" })).toBeVisible();
    await expect(diff.locator(".ld-pane", { hasText: "Python" })).toBeVisible();
    // Wait for the client-side render to fill the output panes.
    await expect(diff.locator(".ld-pane-out").first()).not.toBeEmpty();
    await expect(page).toHaveScreenshot("home-livediff.png");
  });

  test("conformance matrix", async ({ page }) => {
    await page.goto("/");
    const matrix = page.locator(".cx-matrix");
    await expect(matrix).toBeVisible();
    await expect(matrix).toHaveScreenshot("home-matrix.png");
  });
});

test("playground renders live chemistry", async ({ page }) => {
  await page.goto("/playground/");
  const renderer = page.locator(".live-renderer").first();
  await expect(renderer).toBeVisible();
  await expect(renderer).toHaveScreenshot("playground.png");
});

test("implement overview shows the three packages", async ({ page }) => {
  await page.goto("/implement/");
  await expect(page.locator(".live-diff")).toBeVisible();
  await expect(page).toHaveScreenshot("implement.png");
});

for (const lang of ["ruby", "typescript", "python"]) {
  test(`implement/${lang} highlights its lane`, async ({ page }) => {
    await page.goto(`/implement/${lang}/`);
    const here = page.locator(".ld-pane.is-here");
    await expect(here).toBeVisible();
    await expect(here).toHaveScreenshot(`implement-${lang}.png`);
  });
}
