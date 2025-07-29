import { supabase } from '../lib/supabase';
import { useState } from 'react';

export const IMAGE_SIZES = {
  cover: {
    width: 1200,
    height: 630,
    aspectRatio: 1200 / 630
  },
  content: {
    maxWidth: 800,
    maxHeight: 600
  }
} as const;

export const resizeImage = async (
  file: File,
  maxWidth: number,
  maxHeight: number,
  keepAspectRatio = true
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (keepAspectRatio) {
          // En-boy oranını koru
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        } else {
          // Sabit boyuta getir
          width = maxWidth;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas context oluşturulamadı');
        }

        // Görüntü kalitesini artır
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Resim dönüştürülemedi'));
            }
          },
          file.type,
          0.9 // 90% kalite
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Resim yüklenemedi'));
    };

    img.src = URL.createObjectURL(file);
  });
};

export const uploadImage = async (file: File, bucket: string = 'blog-images') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (url: string, bucket: string = 'blog-images') => {
  try {
    const path = url.split('/').pop();
    if (!path) throw new Error('Invalid image URL');

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Image optimization utilities for mobile performance

export const optimizeImageUrl = (url: string, width: number = 800): string => {
  if (!url) return '';
  
  // Supabase Storage URL'lerini optimize et
  if (url.includes('supabase.co')) {
    const baseUrl = url.split('?')[0];
    return `${baseUrl}?width=${width}&quality=80&format=webp`;
  }
  
  return url;
};

export const getResponsiveImageUrl = (url: string): {
  mobile: string;
  tablet: string;
  desktop: string;
} => {
  if (!url) return { mobile: '', tablet: '', desktop: '' };
  
  const baseUrl = url.split('?')[0];
  
  return {
    mobile: `${baseUrl}?width=400&quality=70&format=webp`,
    tablet: `${baseUrl}?width=600&quality=75&format=webp`,
    desktop: `${baseUrl}?width=800&quality=80&format=webp`
  };
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = src;
  });
};

export const lazyLoadImage = (src: string, placeholder: string = ''): string => {
  // Intersection Observer ile lazy loading için data-src attribute'u
  return placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjIyIi8+PC9zdmc+';
};

// Image loading state management
export const useImageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadImage = async (src: string) => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      await preloadImage(src);
      setIsLoading(false);
    } catch {
      setHasError(true);
      setIsLoading(false);
    }
  };

  return { isLoading, hasError, loadImage };
}; 