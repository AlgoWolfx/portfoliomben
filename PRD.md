# Portfolyo Web Sitesi PRD

## Proje Özeti

Bu proje, modern bir kişisel portfolyo web sitesidir. Kullanıcının çalışmalarını, bloglarını ve kişisel bilgilerini profesyonel bir şekilde sergileyecek şekilde tasarlanmıştır. Site tek sayfa uygulaması (SPA) olarak geliştirilmiştir ve modern bir kullanıcı arayüzüne sahiptir.

**Önemli Not**: Bu portfolyo web sitesi sadece görüntüleme amaçlıdır. Ziyaretçiler kayıt olamaz veya giriş yapamaz. Sadece site sahibi (admin) admin paneline erişebilir ve içerikleri düzenleyebilir.

## Teknolojik Altyapı

### Ana Teknolojiler

- **Frontend Framework**: React (v18.3.1)
- **Dil**: TypeScript (v5.5.3)
- **Build Aracı**: Vite (v5.4.2)
- **Stil Kütüphanesi**: Tailwind CSS (v3.4.1)
- **Animasyon Kütüphanesi**: Framer Motion (v12.23.7)
- **İkon Kütüphanesi**: Lucide React (v0.344.0)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router DOM (v7.7.0)
- **Form Yönetimi**: React Hook Form (v7.61.0)
- **Bildirimler**: Sonner (v2.0.6)
- **Rich Text Editör**: TipTap (v3.0.7)

### Geliştirme Araçları

- **Linter**: ESLint (v9.9.1)
- **Paket Yöneticisi**: npm
- **TypeScript Compiler**: TypeScript (v5.5.3)
- **PostCSS**: Autoprefixer (v10.4.18) ve PostCSS (v8.4.35)

## Proje Yapısı

Proje, düzenli bir dosya yapısı kullanmaktadır:

- `/src`: Ana kaynak kod klasörü
  - `/components`: Yeniden kullanılabilir UI bileşenleri
    - `/ui`: Shadcn/ui bileşenleri (button.tsx)
    - `BlogCard.tsx`: Blog içeriklerinin kartları
    - `FogBackground.tsx`: Arka plan efekti bileşeni
    - `Navigation.tsx`: Gezinti menüsü bileşeni
    - `PublicLayout.tsx`: Genel site layout'u
    - `AdminLayout.tsx`: Admin panel layout'u
  - `/data`: Statik veri kaynakları
    - `blog.ts`: Blog yazıları verileri
    - `profile.ts`: Profil bilgileri
  - `/pages`: Sayfa bileşenleri
    - `Home.tsx`: Ana sayfa
    - `About.tsx`: Hakkında sayfası
    - `Projects.tsx`: Projeler sayfası
    - `ProjectDetail.tsx`: Proje detay sayfası
    - `Blog.tsx`: Blog yazıları listesi
    - `BlogPost.tsx`: Tekil blog yazısı görüntüleme
    - `Contact.tsx`: İletişim sayfası
    - `NotFound.tsx`: 404 sayfası
    - `/admin`: Admin panel sayfaları
      - `AdminLogin.tsx`: Admin giriş sayfası
      - `AdminDashboard.tsx`: Admin ana panel
      - `AdminProjects.tsx`: Proje yönetimi
      - `AdminBlog.tsx`: Blog yönetimi
      - `AdminAbout.tsx`: Hakkında yönetimi
      - `AdminProfile.tsx`: Profil yönetimi
      - `AdminMessages.tsx`: Mesaj yönetimi
      - `AdminContact.tsx`: İletişim yönetimi
  - `/lib`: Yardımcı kütüphaneler
    - `supabase.ts`: Supabase bağlantısı ve fonksiyonları
    - `utils.ts`: Genel yardımcı fonksiyonlar
    - `/hooks`: Custom React hooks
      - `useProfile.ts`: Profil verisi hook'u
      - `useContactInfo.ts`: İletişim bilgileri hook'u
  - `App.tsx`: Ana uygulama bileşeni
  - `main.tsx`: Uygulama başlangıç noktası

## Özellikler

### Genel Site Özellikleri

1. **Gezinti Menüsü**:
   - Responsive tasarım (mobil ve masaüstü görünümleri)
   - Animasyonlu geçişler
   - Aktif sayfa vurgusu

2. **Ana Sayfa**:
   - Profil bilgileri ve fotoğraf
   - Animasyonlu bileşenler
   - Blog ve projeler için yönlendirme butonları
   - Kaydırma göstergesi

3. **Hakkında Sayfası**:
   - Kişisel bilgiler
   - Yetenekler
   - Deneyimler

4. **Projeler Sayfası**:
   - Proje kartları
   - Proje detay sayfaları
   - Teknoloji etiketleri

5. **Blog**:
   - Blog yazıları listesi
   - Tekil blog yazısı görüntüleme
   - Rich text içerik desteği

6. **İletişim Sayfası**:
   - İletişim formu
   - Sosyal medya bağlantıları
   - Konum ve zaman dilimi bilgileri

### Admin Panel Özellikleri

1. **Güvenlik**:
   - Supabase Auth ile e-posta/şifre doğrulaması
   - Sadece tek admin hesabı
   - Oturum yönetimi

2. **Profil Yönetimi**:
   - İsim, soyisim güncelleme
   - Unvan/pozisyon güncelleme
   - Hakkında metni güncelleme
   - Profil fotoğrafı yükleme
   - Sosyal medya linkleri düzenleme
   - Yetenekler listesi düzenleme

3. **Blog Yönetimi**:
   - Blog yazılarını listeleme (tablo formunda)
   - Yeni blog yazısı ekleme
   - Var olan blog yazısını düzenleme
   - Blog yazısı silme
   - Rich text editör (TipTap) ile içerik düzenleme
   - Kapak görseli yükleme

4. **Proje Yönetimi**:
   - Projeleri listeleme (tablo formunda)
   - Yeni proje ekleme
   - Var olan projeyi düzenleme
   - Proje silme
   - Proje görselleri yükleme
   - Teknoloji etiketleri yönetimi

5. **İletişim Yönetimi**:
   - Gelen mesajları görüntüleme
   - Mesajları silme
   - Mesajları okundu olarak işaretleme
   - İletişim bilgilerini düzenleme

### UI/UX Özellikleri

1. **Modern Tasarım**:
   - Koyu tema arayüzü
   - Sis efektli arka plan
   - Minimalist yaklaşım
   - Shadcn/ui bileşenleri

2. **Animasyonlar**:
   - Sayfa geçişleri
   - Etkileşim animasyonları (hover, tıklama)
   - Yumuşak kaydırma efektleri

3. **Responsive Tasarım**:
   - Mobil öncelikli yaklaşım
   - Farklı ekran boyutları için optimize edilmiş görünüm

4. **Admin Panel Tasarımı**:
   - Siyah arka plan (koyu tema)
   - Basit ve minimal UI
   - Ana siteden tamamen bağımsız tasarım
   - Sadece işlevselliğe odaklı

## Veri Yönetimi

### Supabase Entegrasyonu

1. **Veritabanı Tabloları**:
   - `projects`: Proje bilgileri
   - `contact_info`: İletişim bilgileri
   - `profiles`: Kullanıcı profilleri (gelecek)

2. **Storage**:
   - Proje görselleri
   - Blog kapak görselleri
   - Profil fotoğrafları

3. **Güvenlik**:
   - Row Level Security (RLS) politikaları
   - Sadece okuma erişimi (genel kullanıcılar)
   - Tam erişim (admin)

## Kullanıcı Hikayeleri

### Genel Ziyaretçiler
1. Ziyaretçi olarak, kişinin yetenekleri ve deneyimleri hakkında bilgi edinebilmek istiyorum.
2. Ziyaretçi olarak, kişinin projelerini inceleyebilmek istiyorum.
3. Ziyaretçi olarak, kişinin blog yazılarını okuyabilmek istiyorum.
4. Ziyaretçi olarak, kişi ile iletişime geçebilmek istiyorum.
5. Ziyaretçi olarak, mobil cihazımdan da siteyi rahatça kullanabilmek istiyorum.

### Admin (Site Sahibi)
1. Admin olarak, profil bilgilerimi güncelleyebilmek istiyorum.
2. Admin olarak, yeni projeler ekleyebilmek istiyorum.
3. Admin olarak, blog yazıları yazabilmek ve düzenleyebilmek istiyorum.
4. Admin olarak, gelen mesajları görebilmek ve yönetebilmek istiyorum.
5. Admin olarak, site içeriklerini güvenli bir şekilde yönetebilmek istiyorum.

## Performans ve Optimizasyon Hedefleri

1. Hızlı sayfa yüklenme süreleri
2. Uygun boyutlu görseller
3. Minimal kod yükü
4. Lazy loading ile gerektiğinde içerik yükleme
5. Supabase optimizasyonları

## Güvenlik Önlemleri

1. **Kimlik Doğrulama**: Supabase Auth ile güvenli admin girişi
2. **Veri Güvenliği**: Row Level Security ile veri erişim kontrolü
3. **Admin Erişimi**: Sadece tek admin hesabı, genel kullanıcılar kayıt olamaz
4. **Dosya Güvenliği**: Supabase Storage ile güvenli dosya yönetimi

## Şu Ana Kadar Tamamlanan Geliştirmeler

### ✅ Tamamlanan Özellikler

1. **Temel Proje Yapısı**:
   - React + TypeScript + Vite kurulumu
   - Tailwind CSS entegrasyonu
   - Shadcn/ui bileşen sistemi
   - ESLint konfigürasyonu

2. **Routing Sistemi**:
   - React Router DOM entegrasyonu
   - Public ve Admin route'ları ayrımı
   - Layout sistemi (PublicLayout, AdminLayout)

3. **Supabase Entegrasyonu**:
   - Supabase client kurulumu
   - Veritabanı şeması oluşturuldu
   - Row Level Security politikaları
   - Storage bucket'ları

4. **Admin Panel**:
   - Admin giriş sayfası
   - Admin dashboard
   - Proje yönetimi (CRUD işlemleri)
   - Blog yönetimi (CRUD işlemleri)
   - Profil yönetimi
   - İletişim yönetimi
   - Mesaj yönetimi

5. **Genel Site Sayfaları**:
   - Ana sayfa (Home)
   - Hakkında sayfası (About)
   - Projeler sayfası (Projects)
   - Proje detay sayfası (ProjectDetail)
   - Blog sayfası (Blog)
   - Blog yazısı detay sayfası (BlogPost)
   - İletişim sayfası (Contact)
   - 404 sayfası (NotFound)

6. **UI/UX Geliştirmeleri**:
   - Koyu tema tasarımı
   - Responsive tasarım
   - Framer Motion animasyonları
   - FogBackground efekti
   - Navigation bileşeni

7. **Form ve Veri Yönetimi**:
   - React Hook Form entegrasyonu
   - Zod validasyonu
   - TipTap rich text editörü
   - Dosya yükleme sistemi

8. **Bildirim Sistemi**:
   - Sonner toast bildirimleri
   - Başarı/hata mesajları

## Gelecek Geliştirmeler

1. **Blog Sistemi Geliştirmeleri**:
   - Blog yazıları için yorum sistemi
   - Blog kategorileri
   - Blog arama özelliği

2. **Proje Sistemi Geliştirmeleri**:
   - Proje filtreleme özellikleri
   - Proje kategorileri
   - Proje arama özelliği

3. **Genel Geliştirmeler**:
   - Tema değişimi (açık/koyu tema)
   - Çoklu dil desteği
   - SEO optimizasyonları
   - Analytics entegrasyonu

4. **Admin Panel Geliştirmeleri**:
   - Dashboard analytics
   - Toplu işlemler
   - Gelişmiş editör özellikleri

## Teknik Borçlar ve Limitler

1. **Mevcut Durum**:
   - Blog yazıları için tam CRUD sistemi mevcut
   - Proje yönetimi tamamen fonksiyonel
   - Admin paneli tamamen çalışır durumda
   - Supabase entegrasyonu tamamlandı

2. **Gelecek İyileştirmeler**:
   - Daha gelişmiş SEO optimizasyonları
   - Performance optimizasyonları
   - Daha fazla admin panel özelliği

## Sonuç

Bu portfolyo web sitesi, modern web teknolojileri kullanılarak geliştirilmiş, estetik ve fonksiyonel bir kişisel tanıtım platformudur. React ve TypeScript tabanlı yapısı ile geliştirmeye açık, Tailwind CSS ile hızlı stil değişikliklerine olanak tanıyan, Framer Motion ile zenginleştirilmiş kullanıcı deneyimi sunan bir projedir. 

**Önemli Özellik**: Site sadece görüntüleme amaçlıdır. Ziyaretçiler kayıt olamaz veya giriş yapamaz. Sadece site sahibi (admin) admin paneline erişebilir ve içerikleri düzenleyebilir. Bu sayede güvenli ve kontrollü bir içerik yönetimi sağlanmıştır. 