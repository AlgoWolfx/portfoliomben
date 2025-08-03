// Image optimization utilities for better mobile performance

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
}

// Responsive image sizes for different screen widths
export const imageSizes = {
  mobile: 640,
  tablet: 1024,
  desktop: 1920,
};

// Generate srcSet for responsive images
export const generateSrcSet = (src: string): string => {
  const extension = src.split('.').pop();
  const basePath = src.replace(`.${extension}`, '');
  
  return `
    ${basePath}-640w.${extension} 640w,
    ${basePath}-1024w.${extension} 1024w,
    ${basePath}-1920w.${extension} 1920w
  `.trim();
};

// Optimized Image component with lazy loading
export const OptimizedImage: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  className = '',
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
      // Add blur placeholder for better perceived performance
      style={{
        backgroundImage: `url(${src}?w=20&blur=10)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
  );
};

// Preload critical images
export const preloadImage = (src: string): void => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

// Check if browser supports WebP
export const supportsWebP = (): boolean => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('image/webp') === 0;
};