# Admin Paneli Gereklilikleri

## Genel Tasarım
- Siyah arka plan (koyu tema)
- Çok basit ve minimal UI
- Ana siteden tamamen bağımsız tasarım
- Sadece işlevselliğe odaklı, estetik kaygı minimum düzeyde

## Gerekli Sayfalar

### 1. Giriş Ekranı
- Basit e-posta ve şifre girişi
- Otomatik oturum hatırlama seçeneği
- Hata mesajları

### 2. Ana Panel
- Sol tarafta basit bir menü
- Sağ tarafta içerik alanı
- Üst kısımda çıkış yapma butonu

### 3. Profil Yönetimi
- İsim, soyisim güncelleme
- Unvan/pozisyon güncelleme
- Hakkında metni güncelleme
- Profil fotoğrafı yükleme
- Sosyal medya linkleri düzenleme
- Yetenekler listesi düzenleme

### 4. Blog Yönetimi
- Blog yazılarını listeleme (tablo formunda)
- Yeni blog yazısı ekleme
- Var olan blog yazısını düzenleme
- Blog yazısı silme
- Her blog için: başlık, içerik, tarih, kapak görseli

### 5. Proje Yönetimi
- Projeleri listeleme (tablo formunda)
- Yeni proje ekleme
- Var olan projeyi düzenleme
- Proje silme
- Her proje için: isim, açıklama, görseller, teknolojiler, link

### 6. İletişim Formu Yönetimi
- Gelen mesajları görüntüleme
- Mesajları silme
- Mesajları okundu olarak işaretleme

## Teknik Gereklilikler

### Veri Depolama
- Tüm veriler Supabase'de saklanacak
- Görseller Supabase Storage'da tutulacak

### Kimlik Doğrulama
- Supabase Auth ile e-posta/şifre doğrulaması
- Sadece tek bir admin hesabı olacak

### Editör
- Blog yazıları için basit bir rich text editörü (Markdown desteği)

### Medya Yönetimi
- Basit bir resim yükleme arayüzü
- Yüklenen resimlerin önizlemesi

## Uygulama Özellikleri
- İşlem sonrası bildirimler (başarılı/başarısız)
- Oturum yönetimi (session handling)
- Form doğrulama (validation)
- Yükleme göstergeleri (loading indicators)

## Dışarıda Bırakılanlar
- Karmaşık tasarım öğeleri
- Gereksiz animasyonlar
- Ana siteyle benzer görsel öğeler
- İleri düzey analitik
- Çoklu kullanıcı desteği 