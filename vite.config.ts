import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Production güvenliği
    sourcemap: false, // Source map'leri kapat
    minify: 'terser', // Terser ile minify
    rollupOptions: {
      output: {
        // Console.log'ları kaldır
        manualChunks: undefined,
      },
    },
    // Güvenlik için ek ayarlar
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    // Production'da console.log'ları kaldır
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
});
