import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/SocialMedia/',
  build: {
    outDir: 'dist',
  },

  server: {
    port: 5001,
  },
});
