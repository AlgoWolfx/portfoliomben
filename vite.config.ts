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
          // React vendor chunk'ları
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // UI kütüphaneleri - daha küçük chunk'lara böl
          motion: ['framer-motion'],
          icons: ['lucide-react', '@radix-ui/react-icons'],
          // Form kütüphaneleri
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Editor kütüphaneleri - büyük chunk
          editor: ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-color', '@tiptap/extension-heading', '@tiptap/extension-highlight', '@tiptap/extension-image', '@tiptap/extension-link', '@tiptap/extension-placeholder', '@tiptap/extension-text-align', '@tiptap/extension-text-style', '@tiptap/extension-underline'],
          // Supabase
          supabase: ['@supabase/supabase-js'],
          // Utils
          utils: ['dompurify', 'class-variance-authority', 'clsx', 'tailwind-merge']
        },
        // Asset dosya isimlendirmesi
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      // Tree-shaking optimizasyonu
      treeshake: {
        preset: 'recommended',
        manualPureFunctions: ['console.log', 'console.info', 'console.warn']
      }
    },
    // Güvenlik için ek ayarlar
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    // Mobil optimizasyonları
    chunkSizeWarningLimit: 500, // Chunk boyutu uyarısını düşür
    // CSS optimizasyonu
    cssCodeSplit: true,
    // Asset optimizasyonu
    assetsInlineLimit: 4096, // 4KB'dan küçük asset'leri inline et
    // Terser optimizasyonları
    terserOptions: {
      compress: {
        drop_console: true, // Console.log'ları kaldır
        drop_debugger: true, // Debugger'ları kaldır
        pure_funcs: ['console.log', 'console.info', 'console.warn'], // Bu fonksiyonları kaldır
        passes: 2 // İki geçişte optimize et
      },
      mangle: {
        safari10: true // Safari 10 uyumluluğu
      },
      format: {
        comments: false // Yorumları kaldır
      }
    }
  },
  define: {
    // Production'da console.log'ları kaldır
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  // Mobil optimizasyonları
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@tiptap/react'] // Büyük kütüphaneleri lazy load için dışarıda bırak
  },
  // Server optimizasyonları
  server: {
    hmr: {
      overlay: false, // HMR overlay'i kapat
    },
  },
  // Experimental optimizasyonlar
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    target: 'esnext',
    // Production'da console.log'ları kaldır
    pure: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info', 'console.warn'] : []
  }
});
