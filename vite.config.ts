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
          vendor: ['react', 'react-dom'],
          // UI kütüphaneleri
          ui: ['framer-motion', 'lucide-react', '@radix-ui/react-icons'],
          // Form kütüphaneleri
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Editor kütüphaneleri
          editor: ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-color', '@tiptap/extension-heading', '@tiptap/extension-highlight', '@tiptap/extension-image', '@tiptap/extension-link', '@tiptap/extension-placeholder', '@tiptap/extension-text-align', '@tiptap/extension-text-style', '@tiptap/extension-underline'],
          // Supabase
          supabase: ['@supabase/supabase-js'],
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
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
  },
  // Server optimizasyonları
  server: {
    hmr: {
      overlay: false, // HMR overlay'i kapat
    },
  },
});
