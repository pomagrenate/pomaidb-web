import { test, expect } from "@playwright/test";

test("normal vectors pipeline ingests, searches, iterates", async ({ page }) => {
  await page.goto("/wasm-playground/normal?test=1");
  const first = await page.evaluate(async () => {
    const api = (window as Window & { __playgroundTest?: any }).__playgroundTest;
    return api.runNormalPipeline();
  });
  const second = await page.evaluate(async () => {
    const api = (window as Window & { __playgroundTest?: any }).__playgroundTest;
    return api.runNormalPipeline();
  });
  expect(first.result.ids.length).toBeGreaterThan(0);
  expect(first.result.ids[0]).toBeGreaterThan(0);
  expect(first.iterStats.throughput).toBeGreaterThan(0);
  expect(second.result.ids).toEqual(first.result.ids);
});

test("rag pipeline retrieves chunks", async ({ page }) => {
  await page.goto("/wasm-playground/rag?test=1");
  const result = await page.evaluate(async () => {
    const api = (window as Window & { __playgroundTest?: any }).__playgroundTest;
    return api.runRagPipeline();
  });
  expect(result.result.ids.length).toBeGreaterThan(0);
});
