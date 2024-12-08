import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/src/main/webapp', // Build output directory matches the backend's static file location
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Backend URL during local dev
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
