import { test, expect } from "@playwright/test";

test("pomai search docs navigation", async ({ page }) => {
  await page.goto("/pomai-search");
  await expect(page.getByRole("heading", { name: "Pomai Search Engine" })).toBeVisible();

  await page.getByRole("link", { name: "API Reference" }).first().click();
  await expect(page.getByRole("heading", { name: "API reference" })).toBeVisible();

  await page.goto("/pomai-search/playground");
  await expect(page.getByRole("heading", { name: "Playground" })).toBeVisible();
});
