import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
    passWithNoTests: true,
    // PGlite'ın açılışı yüklü makinede 10 sn'yi aşabiliyor.
    hookTimeout: 60000,
    testTimeout: 60000,
  },
});
