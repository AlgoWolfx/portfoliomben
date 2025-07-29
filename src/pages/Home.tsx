import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Profile {
  name: string;
  title: string;
  about: string;
  avatar_url: string | null;
  social_links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  skills: string[];
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
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-600 shadow-2xl">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
        </motion.div>

        {/* Name and Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {profile.name}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 font-light">
            {profile.title}
          </p>
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          {aboutData ? aboutData.story : profile.about}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Blog
            <ArrowRight size={20} className="ml-2" />
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center px-8 py-3 border border-gray-600 text-white font-medium rounded-lg hover:bg-gray-800 hover:border-gray-500 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Projects
            <Download size={20} className="ml-2" />
          </motion.button>
        </motion.div>



        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-600 rounded-full mx-auto flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;