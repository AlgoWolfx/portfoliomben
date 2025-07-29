# 02. Vercel Kurulumu Modülü

## 🚀 Vercel Kurulum Adımları

### 1. Vercel Hesabı Oluşturma
- [ ] [vercel.com](https://vercel.com) adresine git
- [ ] GitHub hesabıyla giriş yap
- [ ] Ücretsiz plan seç

### 2. Vercel CLI Kurulumu
```bash
# Global olarak Vercel CLI kurulumu
npm install -g vercel

# Vercel'e giriş yap
vercel login
```

### 3. Proje Konfigürasyonu
```bash
# Proje dizininde
vercel init

# Veya mevcut projeyi bağla
vercel link
```

## 📋 Vercel Konfigürasyonu

### Build Ayarları
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### Environment Variables (Vercel Dashboard'da)
```
VITE_SUPABASE_URL=https://zsjtrviadblsonpqnaqc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ADMIN_SECRET_PATH=__q7r5t9m2v4b1
```

## 🔧 Vercel Dashboard Ayarları

### Environment Variables Ekleme
1. Vercel Dashboard'a git
2. Projeni seç
3. "Settings" → "Environment Variables"
4. Her variable'ı ekle:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://zsjtrviadblsonpqnaqc.supabase.co`
   - **Environment**: Production, Preview, Development

### Domain Ayarları
- [ ] Vercel'in ücretsiz domain'ini kullan
- [ ] SSL sertifikası otomatik aktif
- [ ] Custom domain ekleme (opsiyonel)

## 📝 Sonraki Adımlar

1. **Vercel CLI Kurulumu**
2. **Proje Bağlantısı**
3. **Environment Variables Ayarlama**
4. **İlk Deployment**

## ⚠️ Önemli Notlar

- Vercel ücretsiz planı yeterli
- Environment variables güvenli şekilde saklanacak
- SSL sertifikası otomatik
- Custom domain eklenebilir 