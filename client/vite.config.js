import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Backend server URL
        changeOrigin: true,
        secure: false, // Use true only if backend uses HTTPS with valid certs
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Ensures the API path is preserved
      },
    },
  },
});
