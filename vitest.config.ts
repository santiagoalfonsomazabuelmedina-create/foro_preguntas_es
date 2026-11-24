// Dos grupos de pruebas:
//   unit         rápidas, sin base de datos       → npm test
//   integration  API + PostgreSQL de pruebas real  → npm run test:integration
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'integration',
          include: ['tests/integration/**/*.test.ts'],
          globalSetup: ['tests/integration/global-setup.ts'],
          fileParallelism: false,
        },
      },
    ],
  },
});
