import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    allowedHosts: [
      'localhost',
      '4tsxhm-5173.csb.app',
      'nrvcvp-5173.csb.app'
    ]
  }
});
