import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

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

const BlogCard: React.FC<BlogCardProps> = memo(({ post, index, onReadMore }) => {
  const { shouldReduceMotion } = useMobileOptimization();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const cardAnimation = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: Math.min(index * 0.1, 0.3) },
        whileHover: { y: -3 }
      };

  return (
    <motion.article
      {...cardAnimation}
      className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition-all duration-300 group"
    >
      {post.image_url && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={post.image_url} 
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              console.error(`Image failed to load: ${post.image_url}`);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center text-gray-400 text-sm mb-3">
          <Calendar size={16} className="mr-2" />
          <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
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
          whileHover={shouldReduceMotion ? {} : { x: 5 }}
        >
          Read More
          <ArrowRight size={16} className="ml-2" />
        </motion.button>
      </div>
    </motion.article>
  );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;