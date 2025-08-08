import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  slug: string;
  image_url: string | null;
  created_at: string;
  description?: string;
  is_draft?: boolean;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}

// Blog görselleri için stil sabitleri
const COVER_IMAGE_STYLES = {
  aspectRatio: '1200/630',
  maxHeight: '630px'
};

const ImageModal: React.FC<ImageModalProps> = ({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex,
  onPrevious,
  onNext
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrevious();
      if (e.key === 'ArrowRight') onNext();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevious, onNext]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Kapat butonu */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-black/50 rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        {/* Önceki/Sonraki butonları */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrevious(); }}
              className="absolute left-4 p-2 text-white/80 hover:text-white bg-black/50 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-4 p-2 text-white/80 hover:text-white bg-black/50 rounded-full transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Resim */}
        <motion.img
          key={images[currentIndex]}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          src={images[currentIndex]}
          alt="Blog görseli"
          className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Resim sayacı */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-white/80 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// TypeScript için window tanımını genişlet
interface CustomWindow extends Window {
  handleBlogImageClick?: (index: number) => void;
}

declare let window: CustomWindow;

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);

  const fetchBlogPost = useCallback(async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_draft', false) // Sadece yayınlanan yazıları göster
        .single();
        
      if (error) throw error;
      
      setPost(data);
    } catch {
      setError('Failed to load blog post. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBlogPost();
  }, [fetchBlogPost]);

  useEffect(() => {
    if (post) {
      // Tüm resimleri topla (kapak ve içerik resimleri)
      const images: string[] = [];
      if (post.image_url) {
        images.push(post.image_url);
      }

      // İçerikteki resimleri bul
      const contentImages = post.content.match(/<img[^>]+src="([^">]+)"/g)?.map(img => {
        const match = img.match(/src="([^">]+)"/);
        return match ? match[1] : null;
      }).filter(src => src !== null) as string[];

      if (contentImages) {
        images.push(...contentImages);
      }

      setAllImages(images);
    }
  }, [post]);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  // Blog içeriğini işle ve resimlere tıklanabilirlik ekle
  const processContent = (content: string): string => {
    let processedContent = content;
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    let index = post?.image_url ? 1 : 0; // Kapak resmi varsa 1'den başla

    while ((match = imgRegex.exec(content)) !== null) {
      const fullImgTag = match[0];
      const imgWithClick = `${fullImgTag} class="cursor-pointer" onclick="window.handleBlogImageClick(${index})"`;
      processedContent = processedContent.replace(fullImgTag, imgWithClick);
      index++;
    }

    return processedContent;
  };

  // Window'a tıklama işleyicisini ekle
  useEffect(() => {
    const handleBlogImageClick = (index: number) => {
      handleImageClick(index);
    };

    window.handleBlogImageClick = handleBlogImageClick;

    return () => {
      window.handleBlogImageClick = undefined;
    };
  }, [allImages]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const estimatedReadTime = (content: string) => {
    // Average reading speed: 200 words per minute
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-gray-300 mb-8">{error || "The blog post you're looking for doesn't exist."}</p>
          <motion.button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blog
          </motion.button>
        </div>
      </div>
    );
  }

  const readTime = estimatedReadTime(post.content);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Content-visibility mobil için */}
        <style>{`@media (max-width: 768px){ .mobile-content-visibility { content-visibility: auto; contain-intrinsic-size: 1px 1500px; } }`}</style>
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate('/blog')}
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Blog
        </motion.button>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-6">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-2" />
              <span>{readTime} min read</span>
            </div>
          </div>

          {post.description && (
            <div className="mb-8 text-xl text-gray-300 italic border-l-4 border-gray-700 pl-4 py-2">
              {post.description}
            </div>
          )}


        </motion.header>

        {/* Featured Image */}
        {post?.image_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-10 rounded-xl overflow-hidden bg-gray-800 cursor-pointer"
            style={{
              aspectRatio: COVER_IMAGE_STYLES.aspectRatio,
              maxHeight: COVER_IMAGE_STYLES.maxHeight,
            }}
            onClick={() => handleImageClick(0)}
          >
            <img 
              src={post.image_url} 
              alt={post.title}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800 mobile-content-visibility"
        >
          <div
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: post ? processContent(post.content) : '' 
            }}
            style={{
              '--tw-prose-body': '#d1d5db',
              '--tw-prose-headings': '#ffffff',
              '--tw-prose-links': '#d1d5db',
              '--tw-prose-bold': '#ffffff',
              '--tw-prose-code': '#d1d5db',
              '--tw-prose-pre-code': '#d1d5db',
              '--tw-prose-pre-bg': '#1f2937',
              '--tw-prose-quotes': '#d1d5db',
            } as React.CSSProperties}
          />

          {/* Blog Image Gallery Styling */}
          <style dangerouslySetInnerHTML={{__html: `
            .image-gallery {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
              gap: 1.5rem;
              margin: 2rem 0;
            }
            
            .blog-image {
              width: 100%;
              height: auto;
              border-radius: 0.5rem;
              object-fit: cover;
              aspect-ratio: 16/9;
              transition: transform 0.3s ease;
              cursor: pointer;
              max-width: 800px;
              max-height: 600px;
            }
            
            .blog-image:hover {
              transform: scale(1.02);
            }

            @media (max-width: 640px) {
              .image-gallery {
                grid-template-columns: 1fr;
              }
            }

            img {
              cursor: pointer;
              transition: opacity 0.2s ease;
            }

            img:hover {
              opacity: 0.9;
            }
          `}} />
        </motion.article>

        {/* Related Posts or Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800 text-center"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">
            Enjoyed this article?
          </h2>
          <p className="text-gray-300 mb-6">
            Connect with me to discuss technology, share ideas, or explore collaboration opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
            </motion.button>
            <motion.button
              onClick={() => navigate('/blog')}
              className="px-6 py-3 border border-gray-600 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              More Articles
            </motion.button>
          </div>
        </motion.div>

        {/* Image Modal */}
        <AnimatePresence>
          {modalOpen && (
            <ImageModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              images={allImages}
              currentIndex={currentImageIndex}
              onPrevious={handlePreviousImage}
              onNext={handleNextImage}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogPost;