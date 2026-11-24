// Vite sirve el frontend en desarrollo (http://localhost:5173) y lo empaqueta para producción.
// En desarrollo, toda petición a /api se reenvía al servidor Express en el puerto 3000.
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/app/web',
  build: {
    outDir: '../../../dist/web',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
