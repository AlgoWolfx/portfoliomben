import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Production güvenliği
    sourcemap: false, // Source map'leri kapat
    minify: 'terser', // Terser ile minify
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        // Console.log'ları kaldır
        manualChunks: (id) => {
          // Mobil performans için daha agresif chunk splitting
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation';
            }
            if (id.includes('@tiptap')) {
              return 'editor';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            if (id.includes('lucide-react') || id.includes('@radix-ui')) {
              return 'ui-icons';
            }
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'forms';
            }
            return 'vendor';
          }
        },
        // Asset dosya isimleri
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
      },
    },
    // Güvenlik için ek ayarlar
    target: 'es2015', // Daha geniş tarayıcı desteği
    outDir: 'dist',
    assetsDir: 'assets',
    // Mobil optimizasyonları
    chunkSizeWarningLimit: 500, // Mobil için daha küçük chunk'lar
    // CSS optimizasyonu
    cssCodeSplit: true,
    cssMinify: true,
    // Asset optimizasyonu
    assetsInlineLimit: 4096, // 4KB'dan küçük asset'leri inline et
    // Preload optimization
    modulePreload: {
      polyfill: true,
    },
  },
  define: {
    // Production'da console.log'ları kaldır
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  // Mobil optimizasyonları
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@tiptap/react', '@tiptap/starter-kit'], // Heavy libraries
  },
  // Server optimizasyonları
  server: {
    hmr: {
      overlay: false, // HMR overlay'i kapat
    },
  },
});
