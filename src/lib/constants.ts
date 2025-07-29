// Admin path environment variable'dan al
export const ADMIN_PATH = import.meta.env.VITE_ADMIN_SECRET_PATH || '__q7r5t9m2v4b1';

// Admin URL'leri
export const ADMIN_URLS = {
  LOGIN: `/${ADMIN_PATH}/login`,
  DASHBOARD: `/${ADMIN_PATH}`,
  PROJECTS: `/${ADMIN_PATH}/projects`,
  BLOG: `/${ADMIN_PATH}/blog`,
  ABOUT: `/${ADMIN_PATH}/about`,
  PROFILE: `/${ADMIN_PATH}/profile`,
  MESSAGES: `/${ADMIN_PATH}/messages`,
  CONTACT: `/${ADMIN_PATH}/contact`,
} as const; 