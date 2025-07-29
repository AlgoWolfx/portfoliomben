// Güvenlik yardımcı fonksiyonları
import DOMPurify from 'dompurify';

// Admin URL gizleme için environment variable
const ADMIN_SECRET_PATH = import.meta.env.VITE_ADMIN_SECRET_PATH || '__q7r5t9m2v4b1';

// Admin URL'ini kontrol etme
export const isAdminPath = (path: string): boolean => {
  return path.startsWith(`/${ADMIN_SECRET_PATH}`);
};

// Standart admin path'ini gizli path'e yönlendirme
export const getAdminRedirectPath = (): string => {
  return `/${ADMIN_SECRET_PATH}`;
};

// Rate limiting için basit localStorage tabanlı sistem
export class RateLimiter {
  private static readonly LOGIN_ATTEMPTS_KEY = 'login_attempts';
  private static readonly LOGIN_BLOCKED_KEY = 'login_blocked';
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly BLOCK_DURATION = 15 * 60 * 1000; // 15 dakika

  static checkLoginAttempts(): { canAttempt: boolean; remainingTime?: number } {
    const blockedUntil = localStorage.getItem(this.LOGIN_BLOCKED_KEY);
    
    if (blockedUntil) {
      const remainingTime = parseInt(blockedUntil) - Date.now();
      
      if (remainingTime > 0) {
        return { 
          canAttempt: false, 
          remainingTime: Math.ceil(remainingTime / 1000 / 60) // dakika cinsinden
        };
      } else {
        // Blok süresi dolmuş, temizle
        localStorage.removeItem(this.LOGIN_BLOCKED_KEY);
        localStorage.removeItem(this.LOGIN_ATTEMPTS_KEY);
      }
    }

    return { canAttempt: true };
  }

  static recordFailedLoginAttempt(): void {
    const attempts = parseInt(localStorage.getItem(this.LOGIN_ATTEMPTS_KEY) || '0') + 1;
    localStorage.setItem(this.LOGIN_ATTEMPTS_KEY, attempts.toString());

    if (attempts >= this.MAX_ATTEMPTS) {
      // Maksimum deneme sayısına ulaşıldı, blokla
      const blockedUntil = Date.now() + this.BLOCK_DURATION;
      localStorage.setItem(this.LOGIN_BLOCKED_KEY, blockedUntil.toString());
    }
  }

  static recordSuccessfulLogin(): void {
    // Başarılı giriş sonrası deneme sayısını sıfırla
    localStorage.removeItem(this.LOGIN_ATTEMPTS_KEY);
    localStorage.removeItem(this.LOGIN_BLOCKED_KEY);
  }

  static getRemainingAttempts(): number {
    const attempts = parseInt(localStorage.getItem(this.LOGIN_ATTEMPTS_KEY) || '0');
    return Math.max(0, this.MAX_ATTEMPTS - attempts);
  }
}

// XSS Koruması - DOMPurify ile gelişmiş sanitization
export const sanitizeForXSS = (input: string): string => {
  if (!input) return '';
  
  // DOMPurify ile HTML sanitization
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // Hiçbir HTML tag'ine izin verme
    ALLOWED_ATTR: [], // Hiçbir attribute'a izin verme
    KEEP_CONTENT: true // İçeriği koru ama tag'leri temizle
  });
  
  return sanitized.trim();
};

// HTML content için güvenli sanitization (sadece güvenli tag'lere izin ver)
export const sanitizeHTMLContent = (input: string): string => {
  if (!input) return '';
  
  // DOMPurify ile güvenli HTML sanitization
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote'],
    ALLOWED_ATTR: ['class', 'id'],
    KEEP_CONTENT: true
  });
  
  return sanitized.trim();
};

// Input sanitization fonksiyonları (geriye uyumluluk için)
export const sanitizeInput = (input: string): string => {
  return sanitizeForXSS(input);
};

// Dosya upload güvenliği
export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  // Dosya türü kontrolü
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Sadece resim dosyaları yüklenebilir (JPEG, PNG, GIF, WebP)' 
    };
  }

  // Dosya boyutu kontrolü (5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: 'Dosya boyutu 5MB\'dan büyük olamaz' 
    };
  }

  // Dosya adı sanitization
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  if (sanitizedName !== file.name) {
    return { 
      isValid: false, 
      error: 'Dosya adında geçersiz karakterler var' 
    };
  }

  return { isValid: true };
};

// Session timeout kontrolü
export const checkSessionTimeout = (): boolean => {
  const lastActivity = localStorage.getItem('last_activity');
  if (!lastActivity) return false;

  const now = Date.now();
  const lastActivityTime = parseInt(lastActivity);
  const timeoutDuration = 30 * 60 * 1000; // 30 dakika

  return (now - lastActivityTime) > timeoutDuration;
};

// Son aktivite zamanını güncelle
export const updateLastActivity = (): void => {
  localStorage.setItem('last_activity', Date.now().toString());
};

// Güvenli logout
export const secureLogout = async (): Promise<void> => {
  // Local storage'ı temizle
  localStorage.removeItem('last_activity');
  localStorage.removeItem('login_attempts');
  localStorage.removeItem('login_blocked');
  
  // Supabase logout (bu fonksiyon supabase.ts'de tanımlı)
  // Burada sadece local temizlik yapıyoruz
};

// Session logging kaldırıldı - artık kullanılmıyor

// Error handling için güvenli hata mesajları
export const getSafeErrorMessage = (error: unknown): string => {
  // Production'da detaylı hata mesajlarını gizle
  if (import.meta.env.PROD) {
    return 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
  }
  
  // Development'ta detaylı hata mesajları göster
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  
  return 'Bilinmeyen bir hata oluştu.';
};

// Security logging kaldırıldı - artık kullanılmıyor 