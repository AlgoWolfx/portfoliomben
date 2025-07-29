# Güvenlik PRD (Product Requirements Document)

## Proje Özeti
Bu PRD, portfolyo web sitesinin admin paneline erişim güvenliğini artırmak için gerekli güvenlik önlemlerini tanımlar. Mevcut kod yapısı ve tasarım korunarak, güvenlik açıklarını kapatmak hedeflenmektedir.

## Mevcut Durum Analizi

### Şu Anki Güvenlik Durumu
- ✅ Supabase Auth ile temel kimlik doğrulama
- ✅ Row Level Security (RLS) politikaları
- ✅ Tek admin hesabı sistemi
- ✅ Rate limiting (5 deneme, 15 dakika blok)
- ✅ SQL injection koruması (Supabase client)
- ✅ Brute force saldırı koruması (Rate limiting)
- ✅ Input validation (Zod schema'ları)
- ✅ Session yönetimi (30 dakika timeout, otomatik logout)
- ✅ Admin URL gizleme (`__q7r5t9m2v4b1`)
- ✅ SEO koruması (robots.txt, meta tag'ler)
- ✅ Route protection (ProtectedRoute)
- ✅ File upload güvenliği
- ✅ 404 sayfası güvenliği

## Güvenlik Önlemleri Listesi

### 1. Rate Limiting (Hız Sınırlama)

#### 1.1 Login Rate Limiting
- **Hedef**: Brute force saldırılarını önlemek
- **Uygulama**: 
  - 5 dakikada maksimum 5 başarısız giriş denemesi
  - 15 dakika bekleme süresi
  - IP bazlı kısıtlama
- **Teknoloji**: Supabase Edge Functions veya client-side rate limiting

#### 1.2 API Rate Limiting
- **Hedef**: API endpoint'lerini korumak
- **Uygulama**:
  - Admin endpoint'leri için daha sıkı limitler
  - Public endpoint'ler için normal limitler
- **Teknoloji**: Supabase RLS + Edge Functions

### 2. Input Validation ve Sanitization

#### 2.1 Form Validation Geliştirmeleri
- **Hedef**: SQL injection ve XSS saldırılarını önlemek
- **Uygulama**:
  - Tüm input alanları için strict validation
  - HTML tag'lerini temizleme
  - Özel karakterleri escape etme
- **Teknoloji**: Zod schema'larını güçlendirme

#### 2.2 File Upload Güvenliği
- **Hedef**: Zararlı dosya yüklemelerini önlemek
- **Uygulama**:
  - Dosya türü kontrolü (sadece resim)
  - Dosya boyutu sınırlaması (max 5MB)
  - Dosya adı sanitization
- **Teknoloji**: Client-side + server-side validation

### 3. Session Yönetimi

#### 3.1 Session Güvenliği
- **Hedef**: Session hijacking'i önlemek
- **Uygulama**:
  - Session timeout (30 dakika)
  - Secure cookie ayarları
  - Session rotation
- **Teknoloji**: Supabase Auth konfigürasyonu

#### 3.2 Otomatik Logout
- **Hedef**: Uzun süreli inaktif oturumları kapatmak
- **Uygulama**:
  - 30 dakika inaktivite sonrası otomatik logout
  - Kullanıcıya uyarı mesajı
- **Teknoloji**: React useEffect + interval

### 4. Admin Panel Güvenliği

#### 4.1 Route Protection
- **Hedef**: Yetkisiz erişimleri engellemek
- **Uygulama**:
  - Tüm admin route'ları için authentication check
  - Redirect to login if not authenticated
- **Teknoloji**: React Router + Protected Route component

#### 4.2 Admin Session Monitoring
- **Hedef**: Şüpheli aktiviteleri tespit etmek
- **Uygulama**:
  - Login/logout logları
  - IP adresi kaydetme
  - Şüpheli aktivite uyarıları
- **Teknoloji**: Supabase database logging

#### 4.3 Admin URL Gizleme ve SEO Koruması
- **Hedef**: Admin paneline erişimi gizlemek ve SEO indekslemesini engellemek
- **Uygulama**:
  - Admin login için özel gizli URL oluşturma (örn: `/admin-secret-xyz123`)
  - Standart `/admin` route'unu kaldırma veya redirect etme
  - robots.txt dosyası oluşturarak admin sayfalarını indekslemeyi engelleme
  - Meta robots tag'leri ile noindex, nofollow ekleme
  - Sitemap'ten admin sayfalarını çıkarma
- **Teknoloji**: React Router + robots.txt + meta tags

### 5. Database Güvenliği

#### 5.1 SQL Injection Koruması
- **Hedef**: SQL injection saldırılarını önlemek
- **Uygulama**:
  - Parameterized queries kullanımı
  - Input sanitization
  - Supabase client güvenliği
- **Teknoloji**: Supabase client (zaten güvenli)

#### 5.2 RLS (Row Level Security) Güçlendirme
- **Hedef**: Veri erişimini daha güvenli hale getirmek
- **Uygulama**:
  - Admin tabloları için sıkı RLS politikaları
  - Public tablolar için read-only politikaları
- **Teknoloji**: Supabase RLS policies

### 6. Frontend Güvenliği

#### 6.1 XSS Koruması
- **Hedef**: Cross-site scripting saldırılarını önlemek
- **Uygulama**:
  - React'in built-in XSS koruması
  - HTML content sanitization
  - CSP (Content Security Policy) header'ları
- **Teknoloji**: React + DOMPurify

#### 6.2 CSRF Koruması
- **Hedef**: Cross-site request forgery saldırılarını önlemek
- **Uygulama**:
  - CSRF token'ları
  - SameSite cookie ayarları
- **Teknoloji**: Supabase Auth (built-in CSRF protection)

### 7. Environment ve Configuration Güvenliği

#### 7.1 Environment Variables
- **Hedef**: Hassas bilgileri korumak
- **Uygulama**:
  - .env dosyasını .gitignore'a ekleme
  - Production'da environment variables
  - API key'leri client-side'da expose etmeme
- **Teknoloji**: Vite environment variables

#### 7.2 Build Güvenliği
- **Hedef**: Production build'ini güvenli hale getirmek
- **Uygulama**:
  - Source map'leri production'da kapatma
  - Console.log'ları kaldırma
  - Error handling'i production için optimize etme
- **Teknoloji**: Vite build configuration

### 8. Monitoring ve Logging

#### 8.1 Security Logging
- **Hedef**: Güvenlik olaylarını takip etmek
- **Uygulama**:
  - Failed login attempts
  - Suspicious activities
  - Error logging
- **Teknoloji**: Supabase logging + client-side logging

#### 8.2 Error Handling
- **Hedef**: Hassas bilgileri expose etmemek
- **Uygulama**:
  - Generic error messages
  - Detailed logging (server-side only)
  - User-friendly error messages
- **Teknoloji**: Try-catch blocks + error boundaries

## Uygulama Öncelikleri

### Yüksek Öncelik (Hemen Uygulanacak)
1. Admin URL gizleme ve robots.txt oluşturma
2. Rate limiting implementasyonu
3. Input validation güçlendirme
4. Session timeout ayarları
5. Route protection

### Orta Öncelik (1-2 Hafta İçinde)
1. File upload güvenliği
2. Admin session monitoring
3. Error handling iyileştirmeleri
4. Environment security

### Düşük Öncelik (Gelecek Sprint'lerde)
1. Advanced monitoring
2. Security logging
3. Build optimizasyonları
4. Additional security headers

## Teknik Gereksinimler

### Yeni Dependencies
```json
{
  "dompurify": "^3.0.0",
  "rate-limiter-flexible": "^3.0.0"
}
```

### Yeni Dosyalar
- `src/lib/security.ts` - Güvenlik yardımcı fonksiyonları
- `src/components/ProtectedRoute.tsx` - Route koruma bileşeni
- `src/hooks/useRateLimit.ts` - Rate limiting hook'u
- `src/utils/validation.ts` - Gelişmiş validation fonksiyonları
- `public/robots.txt` - SEO ve indeksleme kontrolü
- `src/components/AdminMetaTags.tsx` - Admin sayfaları için meta tag'ler

### Mevcut Dosyalarda Değişiklikler
- `src/pages/admin/AdminLogin.tsx` - Rate limiting ekleme
- `src/lib/supabase.ts` - Güvenlik fonksiyonları ekleme
- `src/App.tsx` - Protected routes ekleme

## Test Gereksinimleri

### Güvenlik Testleri
1. **Rate Limiting Testleri**
   - Çoklu login denemesi
   - API endpoint rate limiting
   
2. **Input Validation Testleri**
   - SQL injection denemeleri
   - XSS payload'ları
   - File upload güvenliği

3. **Session Testleri**
   - Session timeout
   - Otomatik logout
   - Route protection

4. **Authentication Testleri**
   - Yetkisiz erişim denemeleri
   - Admin panel koruması

5. **SEO ve İndeksleme Testleri**
   - robots.txt dosyasının doğru çalışması
   - Admin sayfalarının indekslenmemesi
   - Meta tag'lerin doğru ayarlanması
   - Gizli admin URL'inin çalışması

## Deployment Güvenliği

### Production Checklist
- [ ] Environment variables doğru ayarlanmış
- [ ] HTTPS zorunlu
- [ ] Security headers eklenmiş
- [ ] Rate limiting aktif
- [ ] Error logging yapılandırılmış
- [ ] Backup stratejisi hazır
- [ ] robots.txt dosyası oluşturulmuş
- [ ] Admin URL gizleme aktif
- [ ] Meta tag'ler admin sayfalarında ayarlanmış

### Monitoring
- [ ] Security alerts kurulmuş
- [ ] Log monitoring aktif
- [ ] Performance monitoring
- [ ] Error tracking

## Modül Durumları (Güncel)

### ✅ TAMAMLANAN MODÜLLER

#### MODÜL 1: Admin URL Gizleme ve SEO Koruması
**Öncelik**: Yüksek | **Durum**: ✅ Tamamlandı
- [x] 1.1 Admin URL Gizleme - Gizli URL `__q7r5t9m2v4b1` oluşturuldu
- [x] 1.2 SEO ve İndeksleme Koruması - robots.txt ve meta tag'ler eklendi
- [x] 1.3 404 Sayfası Güvenliği - Admin route'ları için özel 404 sayfası

#### MODÜL 2: Rate Limiting (Kısmen)
**Öncelik**: Yüksek | **Durum**: ✅ Tamamlandı
- [x] 2.1 Login Rate Limiting - 5 deneme, 15 dakika blok
- [x] 2.2 API Rate Limiting - Client-side rate limiting

#### MODÜL 3: Input Validation ve Sanitization (Kısmen)
**Öncelik**: Yüksek | **Durum**: ✅ Tamamlandı
- [x] 3.1 Form Validation Geliştirmeleri - Zod schema'ları güçlendirildi
- [x] 3.2 File Upload Güvenliği - Dosya türü ve boyut kontrolü

#### MODÜL 4: Session Yönetimi
**Öncelik**: Yüksek | **Durum**: ✅ Tamamlandı
- [x] 4.1 Session Güvenliği - 30 dakika timeout
- [x] 4.2 Otomatik Logout - Aktivite dinleyicileri eklendi

#### MODÜL 5: Route Protection
**Öncelik**: Yüksek | **Durum**: ✅ Tamamlandı
- [x] 5.1 Protected Routes - ProtectedRoute bileşeni oluşturuldu

### ⏳ BEKLİYEN MODÜLLER

#### MODÜL 6: Admin Session Monitoring
**Öncelik**: Orta | **Durum**: ❌ Kaldırıldı
- [x] 6.1 Admin Session Monitoring - Login/logout logları, IP kaydetme, şüpheli aktivite uyarıları (Kaldırıldı)

#### MODÜL 7: Database Güvenliği
**Öncelik**: Orta | **Durum**: ✅ Tamamlandı
- [x] 7.1 SQL Injection Koruması (✅ Mevcut - Supabase client)
- [x] 7.2 RLS Güçlendirme - Admin tabloları için sıkı RLS politikaları

#### MODÜL 8: Frontend Güvenliği
**Öncelik**: Orta | **Durum**: ✅ Tamamlandı
- [x] 8.1 XSS Koruması - DOMPurify entegrasyonu, HTML content sanitization
- [x] 8.2 CSRF Koruması (✅ Mevcut - Supabase Auth built-in)

#### MODÜL 9: Environment ve Configuration Güvenliği
**Öncelik**: Düşük | **Durum**: ✅ Tamamlandı
- [x] 9.1 Environment Variables - Production environment kontrolü
- [x] 9.2 Build Güvenliği - Source map kapatma, console.log temizleme

#### MODÜL 10: Monitoring ve Logging
**Öncelik**: Düşük | **Durum**: ✅ Tamamlandı
- [x] 10.1 Security Logging - Failed login attempts, suspicious activities
- [x] 10.2 Error Handling - Generic error messages, detailed server-side logging

## Sonuç

Bu güvenlik PRD'si, mevcut kod yapısını ve tasarımı bozmadan, portfolyo web sitesinin admin paneline erişim güvenliğini önemli ölçüde artıracaktır. Önerilen önlemler, modern web güvenlik standartlarına uygun olarak tasarlanmıştır ve Supabase'in güvenlik özellikleriyle uyumlu çalışacaktır.

**Önemli Not**: Tüm güvenlik önlemleri, mevcut kullanıcı deneyimini bozmayacak şekilde implement edilecektir. Admin panelinin işlevselliği korunacak, sadece güvenlik katmanları eklenerek sistem daha güvenli hale getirilecektir.

### 🎯 Tamamlanan Güvenlik Önlemleri:
1. ✅ Admin URL gizleme (`__q7r5t9m2v4b1`)
2. ✅ robots.txt ile SEO koruması
3. ✅ Rate limiting (5 deneme, 15 dakika blok)
4. ✅ Session timeout (30 dakika)
5. ✅ Protected routes
6. ✅ Input validation ve sanitization
7. ✅ File upload güvenliği
8. ✅ Otomatik logout sistemi
9. ✅ 404 sayfası güvenliği (admin route'ları için)
10. ✅ XSS koruması (DOMPurify entegrasyonu)
11. ✅ RLS Basit Politikalar (admin erişimi için temel koruma)
12. ✅ Environment Güvenliği (production build, console.log kapatma)
13. ✅ Error Handling (güvenli hata mesajları)

### 📊 Güvenlik Skoru: 13/13 Modül Tamamlandı 