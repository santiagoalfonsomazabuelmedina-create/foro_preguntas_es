// Pruebas E2E con Playwright. Levanta su propio servidor en el puerto 3100 usando
// la base de PRUEBAS, construye el frontend y abre Chromium.
import { defineConfig, devices } from '@playwright/test';

try {
  process.loadEnvFile('.env');
} catch {
  // En CI no hay .env.
}

const testDatabaseUrl = process.env.TEST_DATABASE_URL ?? '';

export default defineConfig({
  testDir: 'tests/e2e',
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node db/migrate.ts && npm run build && node src/app/server.ts',
    url: 'http://localhost:3100/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      PORT: '3100',
      DATABASE_URL: testDatabaseUrl,
    },
  },
});
