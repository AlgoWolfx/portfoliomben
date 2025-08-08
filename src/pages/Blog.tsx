import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import BlogCard from '../components/BlogCard';

// Mobil kontrolü için yardımcı fonksiyon
const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;

interface BlogPost {
  id: number;
  title: string;
  description: string;
  slug: string;
  image_url?: string | null;
  created_at: string;
}

const Blog: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();

  // Mobil kontrolü
  useEffect(() => {
    const checkMobile = () => {
      setMobile(isMobile());
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true } as AddEventListenerOptions);
    
    return () => window.removeEventListener('resize', checkMobile as EventListener);
  }, []);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_draft', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReadMore = (postId: number) => {
    const post = blogPosts.find(p => p.id === postId);
    if (post) {
      navigate(`/blog/${post.slug}`);
    }
  };

  // Mobilde animasyonları kapat
  const animationProps = useMemo(() => {
    if (mobile) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 }
      };
    }
    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8 }
    };
  }, [mobile]);

  const headerAnimation = useMemo(() => {
    if (mobile) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 }
      };
    }
    return {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8 }
    };
  }, [mobile]);

  const buttonAnimation = useMemo(() => {
    if (mobile) {
      return {};
    }
    return {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 }
    };
  }, [mobile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          {...headerAnimation}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Thoughts, insights, and experiences from my journey in software development
          </p>
        </motion.div>

        {/* Blog Posts */}
        <motion.div
          {...animationProps}
          transition={{ ...animationProps.transition, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={mobile ? { contentVisibility: 'auto', containIntrinsicSize: '1px 1000px' } as React.CSSProperties : undefined}
        >
            {blogPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                index={index}
                onReadMore={handleReadMore}
              />
            ))}
        </motion.div>

        {/* Empty State */}
        {blogPosts.length === 0 && (
          <motion.div
            {...animationProps}
            className="text-center py-16"
          >
            <p className="text-gray-400 text-lg">
              No blog posts available at the moment.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog;