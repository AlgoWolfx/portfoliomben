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
        manualChunks: {
          // Vendor chunk'ları ayır
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          // UI kütüphaneleri - daha agresif splitting
          'framer-motion': ['framer-motion'],
          'lucide-icons': ['lucide-react'],
          'radix-ui': ['@radix-ui/react-icons', '@radix-ui/react-slot'],
          // Form kütüphaneleri
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Supabase
          'supabase': ['@supabase/supabase-js'],
          // Diğer kütüphaneler
          'utils': ['clsx', 'class-variance-authority', 'tailwind-merge'],
        },
      },
    },
    // Güvenlik için ek ayarlar
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    // Mobil optimizasyonları
    chunkSizeWarningLimit: 1000,
    // CSS optimizasyonu
    cssCodeSplit: true,
    // Asset optimizasyonu
    assetsInlineLimit: 4096, // 4KB'dan küçük asset'leri inline et
  },
  define: {
    // Production'da console.log'ları kaldır
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  // Mobil optimizasyonları
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'framer-motion', 
      'lucide-react',
      '@radix-ui/react-icons'
    ],
    // Lucide React için tree shaking
    esbuildOptions: {
      treeShaking: true,
    },
  },
  // Server optimizasyonları
  server: {
    hmr: {
      overlay: false, // HMR overlay'i kapat
    },
  },
});
