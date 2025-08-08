import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Github, ExternalLink, ArrowLeft } from 'lucide-react';
import { getProjectById, type Project } from '@/lib/supabase';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        if (!id) throw new Error('Project ID not found');
        const data = await getProjectById(id);
        setProject(data);
        setError(null);
      } catch {
        setError('An error occurred while loading project details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error!</h2>
          <p className="text-gray-400">{error || 'Project not found'}</p>
          <Link to="/projects" className="text-blue-500 hover:text-blue-400 mt-4 inline-block">
            <ArrowLeft className="inline mr-2" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Link
        to="/projects"
        className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="mr-2" />
        Back to Projects
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg overflow-hidden"
      >
        {project.image_url && (
          <div className="relative h-96 overflow-hidden">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover"
              fetchPriority={typeof window !== 'undefined' && window.innerWidth <= 768 ? 'high' : undefined}
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-gray-300 whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          <div className="flex gap-6">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Github size={24} />
                <span>GitHub Repo</span>
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink size={24} />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetail; 