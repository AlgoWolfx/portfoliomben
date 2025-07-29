import { z } from 'zod';
import { sanitizeInput, sanitizeHTMLContent } from '../lib/security';

// Temel input validation şemaları
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required')
  .max(255, 'Email is too long')
  .transform((val) => sanitizeInput(val));

export const passwordSchema = z
  .string()
  .min(6, 'Şifre en az 6 karakter olmalıdır')
  .max(128, 'Şifre çok uzun')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir');

export const titleSchema = z
  .string()
  .min(1, 'Başlık gereklidir')
  .max(255, 'Başlık çok uzun')
  .transform((val) => sanitizeInput(val));

export const contentSchema = z
  .string()
  .min(1, 'İçerik gereklidir')
  .max(10000, 'İçerik çok uzun')
  .transform((val) => sanitizeHTMLContent(val));

export const descriptionSchema = z
  .string()
  .min(1, 'Açıklama gereklidir')
  .max(1000, 'Açıklama çok uzun')
  .transform((val) => sanitizeHTMLContent(val));

export const urlSchema = z
  .string()
  .url('Geçerli bir URL giriniz')
  .max(500, 'URL çok uzun')
  .optional()
  .transform((val) => val ? sanitizeInput(val) : val);

// Admin login form şeması
export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Şifre gereklidir'),
  rememberMe: z.boolean().optional(),
});

// Blog form şeması
export const blogFormSchema = z.object({
  title: titleSchema,
  content: contentSchema,
  image_url: urlSchema,
});

// Proje form şeması
export const projectFormSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  image_url: urlSchema,
  github_url: urlSchema,
  live_url: urlSchema,
  technologies: z.array(z.string()).min(1, 'En az bir teknoloji seçiniz'),
});

// Profil form şeması
export const profileFormSchema = z.object({
  first_name: z.string().min(1, 'Ad gereklidir').max(50, 'Ad çok uzun'),
  last_name: z.string().min(1, 'Soyad gereklidir').max(50, 'Soyad çok uzun'),
  title: z.string().min(1, 'Unvan gereklidir').max(100, 'Unvan çok uzun'),
  about: z.string().min(1, 'Hakkında metni gereklidir').max(2000, 'Hakkında metni çok uzun'),
  skills: z.array(z.string()).min(1, 'En az bir yetenek ekleyiniz'),
  social_links: z.object({
    github: urlSchema,
    linkedin: urlSchema,
    twitter: urlSchema,
    website: urlSchema,
  }),
});

// İletişim form şeması
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: emailSchema,
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
});

// Dosya upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Dosya boyutu 5MB\'dan büyük olamaz')
    .refine((file) => {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      return allowedTypes.includes(file.type);
    }, 'Sadece resim dosyaları yüklenebilir (JPEG, PNG, GIF, WebP)')
    .refine((file) => {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      return sanitizedName === file.name;
    }, 'Dosya adında geçersiz karakterler var'),
});

// XSS koruması için özel validation (DOMPurify kullanarak)
export const sanitizeForXSS = (input: string): string => {
  return sanitizeForXSS(input);
};

// SQL injection koruması için özel validation
export const sanitizeForSQL = (input: string): string => {
  if (!input) return '';
  
  // SQL injection karakterlerini escape et
  const sqlInjectionPatterns = [
    /'/g, /"/g, /;/g, /--/g, /\/\*/g, /\*\//g, /union/gi, /select/gi, /insert/gi, 
    /update/gi, /delete/gi, /drop/gi, /create/gi, /alter/gi, /exec/gi, /execute/gi
  ];
  
  let sanitized = input;
  sqlInjectionPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized.trim();
};

// Form validation helper
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: z.ZodIssue) => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Bilinmeyen bir hata oluştu'] };
  }
}; 