import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { supabase } from '../lib/supabase';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface BlogPost {
  id: number;
  title: string;
  description: string;
  slug: string;
  image_url: string | null;
  created_at: string;
}

const Blog: React.FC = memo(() => {
  const navigate = useNavigate();
  const { isMobile, shouldReduceMotion } = useMobileOptimization();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, description, slug, image_url, created_at')
        .eq('is_draft', false) // Sadece yayınlanan yazıları göster
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setBlogPosts(data || []);
    } catch {
      setError('Failed to load blog posts. Please try again later.');
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setSubscribeMessage({
        type: 'error',
        text: 'Please enter a valid email address'
      });
      return;
    }
    
    setSubscribing(true);
    
    // Simulating subscription process
    setTimeout(() => {
      setSubscribeMessage({
        type: 'success',
        text: 'Thank you for subscribing! You will receive updates soon.'
      });
      setEmail('');
      setSubscribing(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubscribeMessage(null);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? {} : { duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Thoughts on technology, development, and the future of digital experiences
          </p>
        </motion.div>

        {/* Blog Posts */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-gray-400">Loading posts...</div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-700 text-red-200 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No blog posts found. Check back soon for new content!
          </div>
        ) : (
          <div className="space-y-8">
            {blogPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                post={post}
                index={index}
                onReadMore={handleReadMore}
              />
            ))}
          </div>
        )}

        {/* Newsletter Signup */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? {} : { duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800 text-center"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Get notified when I publish new articles about technology, development best practices, 
            and industry insights. No spam, just valuable content.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors"
            />
            <motion.button
              type="submit"
              disabled={subscribing}
              className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap disabled:opacity-70"
              whileHover={{ scale: subscribing ? 1 : 1.05 }}
              whileTap={{ scale: subscribing ? 1 : 0.95 }}
            >
              {subscribing ? 'Subscribing...' : 'Subscribe'}
            </motion.button>
          </form>
          
          {subscribeMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-md text-sm ${
                subscribeMessage.type === 'success' 
                  ? 'bg-green-900/50 border border-green-700 text-green-200' 
                  : 'bg-red-900/30 border border-red-700 text-red-200'
              }`}
            >
              {subscribeMessage.text}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
});

export default Blog;