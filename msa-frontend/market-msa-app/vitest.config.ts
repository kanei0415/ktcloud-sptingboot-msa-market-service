import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@components': r('./src/components'),
      '@hooks': r('./src/hooks'),
      '@libs': r('./src/libs'),
      '@providers': r('./src/providers'),
      '@routes': r('./src/routes'),
      '@store': r('./src/store'),
      '@typedef': r('./src/typedef'),
      '@services': r('./src/services'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
