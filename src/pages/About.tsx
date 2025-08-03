import { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface Profile {
  name: string;
  title: string;
  about: string;
  avatar_url: string | null;
  skills: string[];
  social_links?: {
    linkedin: string;
    github: string;
    twitter: string;
    instagram: string;
  };
  email?: string;
}

interface AboutPage {
  story: string;
  philosophy: string;
  current_focus: string[];
}

const About = memo(() => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [aboutData, setAboutData] = useState<AboutPage | null>(null);
  const [loading, setLoading] = useState(true);
  const { shouldReduceMotion } = useMobileOptimization();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Profil bilgilerini al
      const { data: profileData, error: profileError } = await supabase
        .from('profile')
        .select('name, title, about, avatar_url, skills, social_links, email')
        .single();

      if (profileError) throw profileError;

      // About sayfası verilerini al
      const { data: aboutData, error: aboutError } = await supabase
        .from('about_page')
        .select('story, philosophy, current_focus')
        .single();

      if (aboutError) {
        // About sayfası verisi yoksa, profil verisinden oluştur
        setAboutData({
          story: profileData.about || 'Henüz hikaye eklenmedi.',
          philosophy: 'Kaliteli ve kullanıcı dostu yazılımlar geliştirmek.',
          current_focus: profileData.skills || []
        });
      } else {
        setAboutData(aboutData);
      }

      setProfile(profileData);
    } catch {
      // Veriler alınırken hata oluştu
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Profil verisi bulunamadı.</div>
      </div>
    );
  }

  // Eğer aboutData yoksa, profil verisinden oluştur
  const aboutContent = aboutData || {
    story: profile.about || 'Henüz hikaye eklenmedi.',
    philosophy: 'Kaliteli ve kullanıcı dostu yazılımlar geliştirmek.',
    current_focus: profile.skills || []
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
            About Me
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Passionate about creating digital experiences that make a difference
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Bio */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
            transition={shouldReduceMotion ? {} : { duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-semibold text-white mb-4">My Story</h2>
              <p className="text-gray-300 leading-relaxed">
                {aboutContent.story}
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-semibold text-white mb-4">Philosophy</h2>
              <p className="text-gray-300 leading-relaxed">
                {aboutContent.philosophy}
              </p>
            </div>

            {/* Contact */}
            {profile.email && (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-white mb-4">Contact</h2>
                <p className="text-gray-300 mb-4">
                  Feel free to reach out for collaborations or just a friendly chat.
                </p>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">Email:</span>
                  <a href={`mailto:${profile.email}`} className="text-blue-400 hover:text-blue-300 transition-colors">
                    {profile.email}
                  </a>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column - Skills & Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Profile Image */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800 text-center">
              <div className="w-48 h-48 mx-auto rounded-lg overflow-hidden mb-6 border-2 border-gray-700">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600 text-4xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
              <p className="text-gray-400">{profile.title}</p>

              {/* Social Links */}
              {profile.social_links && (
                <div className="flex justify-center space-x-4 mt-4">
                  {profile.social_links.github && (
                    <a 
                      href={profile.social_links.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
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
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                  {profile.social_links.instagram && (
                    <a 
                      href={profile.social_links.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-semibold text-white mb-6">Core Skills</h2>
              <div className="grid grid-cols-2 gap-3">
                {profile.skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                    className="bg-gray-800 px-4 py-2 rounded-lg text-center border border-gray-700"
                  >
                    <span className="text-gray-300 text-sm font-medium">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-semibold text-white mb-4">Current Focus</h2>
              <ul className="space-y-3 text-gray-300">
                {aboutContent.current_focus.map((focus, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    {focus}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

export default About;