# 03. Deployment Süreci Modülü

## 🚀 İlk Deployment

### 1. Production Build Testi
```bash
# Local'de production build testi
npm run build

# Build başarılı mı kontrol et
npm run preview
```

### 2. Vercel Deployment
```bash
# Production'a deploy et
vercel --prod

# Veya sadece deploy (preview)
vercel
```

### 3. Deployment Kontrolü
- [ ] Build süreci başarılı
- [ ] Site erişilebilir
- [ ] Tüm sayfalar çalışıyor
- [ ] Admin paneli erişilebilir

## 📋 Deployment Kontrol Listesi

### ✅ Ön Kontroller
- [ ] `.env` dosyası `.gitignore`'da
- [ ] Environment variables Vercel'de ayarlandı
- [ ] Build komutu çalışıyor
- [ ] TypeScript hataları yok

### ✅ Deployment Sonrası Kontroller
- [ ] Ana sayfa yükleniyor
- [ ] Navigation çalışıyor
- [ ] Blog sayfaları erişilebilir
- [ ] Proje sayfaları çalışıyor
- [ ] İletişim formu çalışıyor
- [ ] Admin paneli giriş yapılabiliyor

## 🔧 Domain ve SSL

### Vercel Ücretsiz Domain
- Format: `your-project.vercel.app`
- SSL: Otomatik aktif
- HTTPS: Otomatik yönlendirme

### Custom Domain (Opsiyonel)
- [ ] Domain satın al
- [ ] DNS ayarları
- [ ] Vercel'de domain ekle

## 📊 Performance Kontrolü

### Lighthouse Audit
- [ ] Performance skoru > 90
- [ ] Accessibility skoru > 90
- [ ] Best Practices skoru > 90
- [ ] SEO skoru > 90

### Core Web Vitals
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

## 🛠️ Sorun Giderme

### Yaygın Sorunlar
1. **Build Hatası**: Environment variables kontrol et
2. **404 Hatası**: Routing ayarları kontrol et
3. **Supabase Bağlantı Hatası**: API key'leri kontrol et
4. **Admin Panel Erişim Hatası**: Auth ayarları kontrol et

### Debug Komutları
```bash
# Build loglarını gör
vercel logs

# Environment variables kontrol et
vercel env ls

# Proje ayarlarını gör
vercel project ls
```

## 📝 Sonraki Adımlar

1. **İlk Deployment**
2. **Site Testleri**
3. **Performance Optimizasyonu**
4. **Monitoring Kurulumu**

## ⚠️ Önemli Notlar

- Deployment öncesi local test yap
- Environment variables doğru ayarlandığından emin ol
- RLS politikaları korunacak
- Mevcut kod yapısı bozulmayacak 