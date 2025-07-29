import React, { useState, useEffect } from 'react';
import ProjectEditor from '@/components/admin/ProjectEditor';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { Project, getProjects, createProject, updateProject, deleteProject, uploadProjectImage } from '@/lib/supabase';
import { toast } from 'sonner';

const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch {
      toast.error('Projeler yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = () => {
    const newProject: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
      title: 'Yeni Proje',
      description: '',
      image_url: '',
      technologies: [],
    };
    setSelectedProject(newProject as Project);
    setIsEditing(true);
  };

  const handleSaveProject = async () => {
    if (!selectedProject) return;

    try {
      setIsSaving(true);

      const projectData = {
        title: selectedProject.title || '',
        description: selectedProject.description || '',
        image_url: selectedProject.image_url || '',
        github_url: selectedProject.github_url || '',
        live_url: selectedProject.live_url || '',
        technologies: Array.isArray(selectedProject.technologies) ? selectedProject.technologies : []
      };

      if ('id' in selectedProject) {
        // Update existing project
        const updatedProject = await updateProject(selectedProject.id, projectData);
        setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        toast.success('Proje başarıyla güncellendi');
      } else {
        // Create new project
        const newProject = await createProject(projectData);
        setProjects(prev => [...prev, newProject]);
        toast.success('Proje başarıyla oluşturuldu');
      }

      setIsEditing(false);
      setSelectedProject(null);
    } catch {
      toast.error('Proje kaydedilirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Proje başarıyla silindi');
    } catch {
      toast.error('Proje silinirken bir hata oluştu');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) {
        toast.error('Lütfen bir dosya seçin');
        return;
      }

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
        return;
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Sadece JPEG, PNG ve WEBP formatları desteklenmektedir');
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Görsel yükleniyor...');

      const imageUrl = await uploadProjectImage(file);
      
      if (selectedProject) {
        setSelectedProject({
          ...selectedProject,
          image_url: imageUrl,
        });
      }
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Görsel başarıyla yüklendi');
    } catch {
      toast.error('Görsel yüklenirken bir hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Projeler</h1>
        <Button onClick={handleCreateProject} className="flex items-center gap-2">
          <Plus size={20} />
          Yeni Proje
        </Button>
      </div>

      {isEditing && selectedProject ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Proje Başlığı
            </label>
            <input
              type="text"
              value={selectedProject.title}
              onChange={(e) => setSelectedProject({
                ...selectedProject,
                title: e.target.value,
              })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Proje Açıklaması
            </label>
            <ProjectEditor
              content={selectedProject.description}
              onChange={(content) => setSelectedProject({
                ...selectedProject,
                description: content,
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Proje Görseli
            </label>
            <div className="flex items-center gap-4">
              {selectedProject.image_url && (
                <img
                  src={selectedProject.image_url}
                  alt={selectedProject.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleImageUpload(e);
                }}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              GitHub URL (Opsiyonel)
            </label>
            <input
              type="text"
              value={selectedProject.github_url || ''}
              onChange={(e) => setSelectedProject({
                ...selectedProject,
                github_url: e.target.value,
              })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Canlı Site URL (Opsiyonel)
            </label>
            <input
              type="text"
              value={selectedProject.live_url || ''}
              onChange={(e) => setSelectedProject({
                ...selectedProject,
                live_url: e.target.value,
              })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Teknolojiler (virgülle ayırın)
            </label>
            <input
              type="text"
              value={selectedProject.technologies.join(', ')}
              onChange={(e) => setSelectedProject({
                ...selectedProject,
                technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
              })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setSelectedProject(null);
              }}
              disabled={isSaving}
            >
              İptal
            </Button>
            <Button
              onClick={handleSaveProject}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-800/50 transition-colors"
            >
              <div className="aspect-video w-full overflow-hidden bg-zinc-800">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    Görsel Yok
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300 border border-zinc-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedProject(project);
                      setIsEditing(true);
                    }}
                  >
                    Düzenle
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    Sil
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProjects; 