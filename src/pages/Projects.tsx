import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { getProjects, type Project } from '@/lib/supabase';
import { Link } from 'react-router-dom';

// Mobil kontrolü için yardımcı fonksiyon
const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
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
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8 }
    };
  }, [mobile]);

  const projectCardAnimation = useMemo(() => {
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
      transition: { duration: 0.6 }
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
        <motion.h1
          {...animationProps}
          className="text-4xl sm:text-5xl font-bold text-white text-center mb-16"
        >
          My Projects
        </motion.h1>

        {/* Projects Grid */}
        <motion.div
          {...animationProps}
          transition={{ ...animationProps.transition, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={mobile ? { contentVisibility: 'auto', containIntrinsicSize: '1px 1000px' } as React.CSSProperties : undefined}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              {...projectCardAnimation}
              transition={{ ...projectCardAnimation.transition, delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
            >
              <Link to={`/projects/${project.id}`} className="block">
                {project.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Github size={20} />
                        <span>GitHub</span>
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <ExternalLink size={20} />
                        <span>Live Site</span>
                      </a>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {projects.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            No projects added yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;