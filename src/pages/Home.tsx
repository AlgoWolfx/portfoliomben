import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getResponsiveImageUrl } from '../utils/imageUtils';

// Mobil kontrolü için yardımcı fonksiyon
const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;

interface Profile {
  name: string;
  title: string;
  about: string;
  avatar_url: string;
  skills: string[];
  social_links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  email?: string;
}

interface AboutPage {
  story: string;
  philosophy: string;
  current_focus: string[];
}

const Home = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [aboutData, setAboutData] = useState<AboutPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState(false);

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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Profil bilgilerini al
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .single();

      if (profileError) throw profileError;

      // About sayfası verilerini al
      const { data: aboutData, error: aboutError } = await supabase
        .from('about_page')
        .select('story, philosophy, current_focus')
        .eq('id', 1)
        .single();

      if (aboutError) {
        // About sayfası verisi alınamadı, profil verisi kullanılıyor
      }

      setProfile(profileData);
      
      // About sayfası verisi varsa kullan, yoksa profil verisinden oluştur
      if (aboutData) {
        const currentFocusArray = Array.isArray(aboutData.current_focus) 
          ? aboutData.current_focus 
          : [];
        
        setAboutData({
          ...aboutData,
          current_focus: currentFocusArray
        });
      } else {
        setAboutData({
          story: profileData.about || 'Henüz hikaye eklenmedi.',
          philosophy: 'Kaliteli ve kullanıcı dostu yazılımlar geliştirmek.',
          current_focus: profileData.skills || []
        });
      }
    } catch {
      // Veriler alınırken hata oluştu
    } finally {
      setLoading(false);
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
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.8, type: "spring" as const, bounce: 0.4 }
    };
  }, [mobile]);

  const buttonAnimationProps = useMemo(() => {
    if (mobile) {
      return {};
    }
    return {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 }
    };
  }, [mobile]);

  // Mobilde responsive görsel URL'leri
  const responsiveImageUrls = useMemo(() => {
    if (!profile?.avatar_url) return { mobile: '', tablet: '', desktop: '' };
    return getResponsiveImageUrl(profile.avatar_url);
  }, [profile?.avatar_url]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Profil bulunamadı.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Profile Image */}
        <motion.div
          {...animationProps}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-600 shadow-2xl">
            {profile.avatar_url ? (
              <picture>
                {/* Mobilde küçük görsel */}
                {mobile && (
                  <source
                    srcSet={responsiveImageUrls.mobile}
                    media="(max-width: 768px)"
                  />
                )}
                {/* Tablet için orta boyut */}
                <source
                  srcSet={responsiveImageUrls.tablet}
                  media="(max-width: 1024px)"
                />
                {/* Desktop için büyük görsel */}
                <img
                  src={responsiveImageUrls.desktop}
                  alt={profile.name}
                  width="128"
                  height="128"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback olarak orijinal URL'i kullan
                    const target = e.target as HTMLImageElement;
                    target.src = profile.avatar_url;
                  }}
                />
              </picture>
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-2xl text-gray-400">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Name and Title */}
        <motion.div
          {...animationProps}
          transition={{ ...animationProps.transition, delay: 0.1 }}
          className="mb-6"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {profile.name}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-6">
            {profile.title}
          </p>
        </motion.div>

        {/* About Section */}
        <motion.div
          {...animationProps}
          transition={{ ...animationProps.transition, delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
            {aboutData?.story || profile.about}
          </p>
        </motion.div>

        {/* Skills/Current Focus */}
        {aboutData?.current_focus && aboutData.current_focus.length > 0 && (
          <motion.div
            {...animationProps}
            transition={{ ...animationProps.transition, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">
              Current Focus
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {aboutData.current_focus.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          {...animationProps}
          transition={{ ...animationProps.transition, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            {...buttonAnimationProps}
            onClick={() => navigate('/projects')}
            className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            View Projects
          </motion.button>
          
          <motion.button
            {...buttonAnimationProps}
            onClick={() => navigate('/contact')}
            className="px-8 py-3 border border-white text-white font-medium rounded-lg hover:bg-white hover:text-black transition-colors"
          >
            Get In Touch
          </motion.button>
        </motion.div>

        {/* Social Links */}
        {profile.social_links && (
          <motion.div
            {...animationProps}
            transition={{ ...animationProps.transition, delay: 0.5 }}
            className="mt-8 flex justify-center space-x-6"
          >
            {profile.social_links.github && (
              <a
                href={profile.social_links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            )}
            
            {profile.social_links.linkedin && (
              <a
                href={profile.social_links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            )}
            
            {profile.social_links.twitter && (
              <a
                href={profile.social_links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;