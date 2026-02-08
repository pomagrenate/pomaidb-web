import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/integration",
  timeout: 60_000,
  webServer: {
    command: "npm run start -- --port 3000",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
});
