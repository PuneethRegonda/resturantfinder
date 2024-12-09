import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    build: {
      outDir: 'build', // Build output directory
      // outDir: '../backend/src/main/webapp', // Build output directory matches the backend's static file location
      emptyOutDir: true,
    },
    server: {
      proxy: {
        '/api': {
          target: isProduction
            ? 'http://3.82.244.78:8080' // Production backend URL
            : 'http://localhost:8080', // Backend URL during local dev
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
