import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { getResponsiveImageUrl } from '../utils/imageUtils';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  slug: string;
  image_url?: string | null;
  created_at: string;
}

interface BlogCardProps {
  post: BlogPost;
  index: number;
  onReadMore: (postId: number) => void;
}

const BlogCard: React.FC<BlogCardProps> = React.memo(({ post, index, onReadMore }) => {
  const formattedDate = useMemo(() => {
    return new Date(post.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [post.created_at]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
  };

  // Mobil için optimize edilmiş animasyon ayarları
  const animationProps = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: index * 0.1 }
  }), [index]);

  // Responsive image URLs
  const imageUrls = useMemo(() => {
    if (!post.image_url) return null;
    return getResponsiveImageUrl(post.image_url);
  }, [post.image_url]);

  return (
    <motion.article
      {...animationProps}
      className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-300 group"
      whileHover={{ y: -3 }}
    >
      {imageUrls && (
        <div className="w-full h-48 overflow-hidden bg-gray-800">
          <picture>
            <source
              srcSet={imageUrls.mobile}
              media="(max-width: 640px)"
            />
            <source
              srcSet={imageUrls.tablet}
              media="(max-width: 1024px)"
            />
            <img 
              src={imageUrls.desktop} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={handleImageError}
            />
          </picture>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center text-gray-400 text-sm mb-3">
          <Calendar size={16} className="mr-2" />
          <time dateTime={post.created_at}>{formattedDate}</time>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gray-200 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          {post.description}
        </p>
        

        
        <motion.button
          onClick={() => onReadMore(post.id)}
          className="inline-flex items-center text-gray-400 hover:text-white text-sm font-medium group-hover:text-white transition-colors"
          whileHover={{ x: 5 }}
        >
          Read More
          <ArrowRight size={16} className="ml-2" />
        </motion.button>
      </div>
    </motion.article>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return prevProps.post.id === nextProps.post.id && 
         prevProps.index === nextProps.index;
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;