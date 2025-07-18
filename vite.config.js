import { defineConfig } from 'vite';

export default defineConfig({
  base: '/HerramientaAfiliado/',
  root: '.',
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});