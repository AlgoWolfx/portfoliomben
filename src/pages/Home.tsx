import React, { useEffect, useState, useMemo, useCallback } from 'react';
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

const Home = React.memo(() => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [aboutData, setAboutData] = useState<AboutPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobile, setMobile] = useState(false);

  // Mobil kontrolü - optimized
  useEffect(() => {
    const checkMobile = () => {
      setMobile(isMobile());
    };
    
    checkMobile();
    
    let timeoutId: NodeJS.Timeout;
    const debouncedCheckMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', debouncedCheckMobile);
    
    return () => {
      window.removeEventListener('resize', debouncedCheckMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  // Data fetching - memoized
  const fetchData = useCallback(async () => {
    try {
      const [profileResponse, aboutResponse] = await Promise.all([
        supabase.from('profile').select('*').single(),
        supabase.from('about_page').select('*').single()
      ]);

      if (profileResponse.data) {
        setProfile(profileResponse.data);
      }
      if (aboutResponse.data) {
        setAboutData(aboutResponse.data);
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Navigation handlers - memoized
  const handleProjectsClick = useCallback(() => {
    navigate('/projects');
  }, [navigate]);

  const handleAboutClick = useCallback(() => {
    navigate('/about');
  }, [navigate]);

  // Animation configurations - memoized for performance
  const animationConfig = useMemo(() => {
    const isMobileDevice = mobile;
    
    return {
      container: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: isMobileDevice ? 0.5 : 0.8 }
      },
      hero: {
        initial: { opacity: 0, y: isMobileDevice ? 20 : 30 },
        animate: { opacity: 1, y: 0 },
        transition: { 
          duration: isMobileDevice ? 0.6 : 0.8, 
          delay: isMobileDevice ? 0.1 : 0.2 
        }
      },
      buttons: {
        whileHover: isMobileDevice ? {} : { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: { duration: 0.1 }
      },
      about: {
        initial: { opacity: 0, y: isMobileDevice ? 15 : 20 },
        animate: { opacity: 1, y: 0 },
        transition: { 
          duration: isMobileDevice ? 0.5 : 0.6, 
          delay: isMobileDevice ? 0.3 : 0.5 
        }
      }
    };
  }, [mobile]);

  // Optimized image URL - memoized
  const optimizedAvatarUrl = useMemo(() => {
    if (!profile?.avatar_url) return '';
    return getResponsiveImageUrl(profile.avatar_url, mobile ? 200 : 300);
  }, [profile?.avatar_url, mobile]);

  // Loading state - optimized
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-black text-white"
      {...animationConfig.container}
      style={{
        willChange: 'opacity',
        transform: 'translateZ(0)'
      }}
    >
      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Sol Taraf - Metin İçeriği */}
          <motion.div 
            className="space-y-6 lg:space-y-8"
            {...animationConfig.hero}
            style={{
              willChange: 'transform, opacity',
              transform: 'translateZ(0)'
            }}
          >
            {profile && (
              <>
                <div className="space-y-2">
                  <motion.h1 
                    className="text-4xl lg:text-6xl font-bold"
                    initial={{ opacity: 0, x: mobile ? -15 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: mobile ? 0.5 : 0.6, delay: mobile ? 0.2 : 0.3 }}
                  >
                    {profile.name}
                  </motion.h1>
                  <motion.p 
                    className="text-xl lg:text-2xl text-gray-300"
                    initial={{ opacity: 0, x: mobile ? -15 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: mobile ? 0.5 : 0.6, delay: mobile ? 0.3 : 0.4 }}
                  >
                    {profile.title}
                  </motion.p>
                </div>

                <motion.p 
                  className="text-lg text-gray-400 leading-relaxed"
                  initial={{ opacity: 0, x: mobile ? -15 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: mobile ? 0.5 : 0.6, delay: mobile ? 0.4 : 0.5 }}
                >
                  {profile.about}
                </motion.p>

                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6"
                  initial={{ opacity: 0, y: mobile ? 15 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: mobile ? 0.5 : 0.6, delay: mobile ? 0.5 : 0.6 }}
                >
                  <motion.button
                    onClick={handleProjectsClick}
                    className="bg-white text-black px-8 py-3 rounded-lg font-medium"
                    {...animationConfig.buttons}
                    style={{
                      willChange: 'transform',
                      transform: 'translateZ(0)'
                    }}
                  >
                    Projelerimi Gör
                  </motion.button>
                  
                  <motion.button
                    onClick={handleAboutClick}
                    className="border border-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800"
                    {...animationConfig.buttons}
                    style={{
                      willChange: 'transform',
                      transform: 'translateZ(0)'
                    }}
                  >
                    Hakkımda
                  </motion.button>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Sağ Taraf - Profil Resmi ve Bilgileri */}
          {profile && (
            <motion.div 
              className="flex flex-col items-center lg:items-end space-y-8"
              {...animationConfig.about}
              style={{
                willChange: 'transform, opacity',
                transform: 'translateZ(0)'
              }}
            >
              {/* Profil Resmi */}
              {optimizedAvatarUrl && (
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: mobile ? 0.5 : 0.6, delay: mobile ? 0.6 : 0.7 }}
                  style={{
                    willChange: 'transform, opacity',
                    transform: 'translateZ(0)'
                  }}
                >
                  <img
                    src={optimizedAvatarUrl}
                    alt={profile.name}
                    className={`rounded-full object-cover border-4 border-gray-700 ${
                      mobile ? 'w-48 h-48' : 'w-64 h-64'
                    }`}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-transparent to-white/10"></div>
                </motion.div>
              )}

              {/* Yetenekler */}
              {profile.skills && profile.skills.length > 0 && (
                <motion.div
                  className="text-center lg:text-right"
                  initial={{ opacity: 0, y: mobile ? 15 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: mobile ? 0.5 : 0.6, delay: mobile ? 0.7 : 0.8 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-200">Yetenekler</h3>
                  <div className="flex flex-wrap justify-center lg:justify-end gap-3 max-w-md">
                    {profile.skills.map((skill, index) => (
                      <motion.span
                        key={skill}
                        className="bg-gray-800 text-gray-200 px-4 py-2 rounded-full text-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: mobile ? 0.3 : 0.4, 
                          delay: (mobile ? 0.8 : 0.9) + index * 0.1 
                        }}
                        style={{
                          willChange: 'transform, opacity',
                          transform: 'translateZ(0)'
                        }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

Home.displayName = 'Home';

export default Home;