import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Eye } from 'lucide-react';
import { getOptimizedImageProps } from '../utils/imageUtils';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  views: number;
  featured_image?: string;
  slug: string;
  onClick: (slug: string) => void;
}

// Mobil cihaz kontrolü
const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;

const BlogCard: React.FC<BlogCardProps> = React.memo(({
  title,
  excerpt,
  author,
  date,
  views,
  featured_image,
  slug,
  onClick
}) => {
  // Mobil optimizasyonları
  const mobile = useMemo(() => isMobile(), []);
  
  // Optimized image props
  const imageProps = useMemo(() => {
    if (!featured_image) return null;
    return getOptimizedImageProps(featured_image, title, 'medium');
  }, [featured_image, title]);

  // Animasyon konfigürasyonu - mobile için optimize edilmiş
  const animationConfig = useMemo(() => ({
    whileHover: mobile ? {} : { y: -5, scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: mobile ? 0.1 : 0.2 }
  }), [mobile]);

  // Date formatting
  const formattedDate = useMemo(() => {
    return new Date(date).toLocaleDateString('tr-TR');
  }, [date]);

  // Handle click
  const handleClick = () => {
    onClick(slug);
  };

  return (
    <motion.article
      className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 cursor-pointer group"
      onClick={handleClick}
      {...animationConfig}
      style={{
        willChange: mobile ? 'transform' : 'transform, box-shadow',
        transform: 'translateZ(0)'
      }}
    >
      {/* Featured Image */}
      {imageProps && (
        <div className="relative h-48 overflow-hidden">
          <img
            {...imageProps}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{
              ...imageProps.style,
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-gray-200 transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
          {excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User size={16} className="mr-1" />
              <span>{author}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <Eye size={16} className="mr-1" />
            <span>{views}</span>
          </div>
        </div>
      </div>

      {/* Read More Button */}
      <div className="px-6 pb-6">
        <motion.button
          className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
          whileHover={mobile ? {} : { x: 5 }}
          transition={{ duration: 0.1 }}
          style={{
            willChange: 'transform, color',
            transform: 'translateZ(0)'
          }}
        >
          Devamını Oku →
        </motion.button>
      </div>
    </motion.article>
  );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;