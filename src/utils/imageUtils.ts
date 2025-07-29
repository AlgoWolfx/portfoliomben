import { supabase } from '../lib/supabase';

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