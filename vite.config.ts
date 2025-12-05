import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Determine the environment variable for the API key.
    // In Vercel, this is accessible during the build process.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  build: {
    outDir: 'dist',
  }
});