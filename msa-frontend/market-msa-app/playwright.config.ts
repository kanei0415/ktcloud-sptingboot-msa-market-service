import { defineConfig, devices } from '@playwright/test';

const DEMO_SLOW_MO = Number(process.env.DEMO_SLOW_MO ?? 500);
const DEMO_VIEWPORT_WIDTH = Number(process.env.DEMO_VIEWPORT_WIDTH ?? 1440);
const DEMO_VIEWPORT_HEIGHT = Number(process.env.DEMO_VIEWPORT_HEIGHT ?? 900);
const DEMO_HEADLESS = process.env.DEMO_HEADLESS === '1';
const DEMO_BASE_URL = process.env.DEMO_BASE_URL ?? 'http://localhost:5173';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: /.*demo\.spec\.ts/,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  timeout: 5 * 60 * 1000,
  use: {
    baseURL: DEMO_BASE_URL,
    headless: DEMO_HEADLESS,
    viewport: { width: DEMO_VIEWPORT_WIDTH, height: DEMO_VIEWPORT_HEIGHT },
    actionTimeout: 30 * 1000,
    navigationTimeout: 30 * 1000,
    trace: 'off',
    video: {
      mode: 'on',
      size: { width: DEMO_VIEWPORT_WIDTH, height: DEMO_VIEWPORT_HEIGHT },
    },
    launchOptions: {
      slowMo: DEMO_SLOW_MO,
      args: ['--window-position=80,40'],
    },
  },
  projects: [
    {
      name: 'demo',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chromium',
        viewport: { width: DEMO_VIEWPORT_WIDTH, height: DEMO_VIEWPORT_HEIGHT },
      },
    },
  ],
  outputDir: './tests/e2e/.artifacts',
});
