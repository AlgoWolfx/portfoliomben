import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Upload, X, Image as ImageIcon, Edit, Trash2, Eye } from 'lucide-react';
import ProjectEditor from '@/components/admin/ProjectEditor';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadImage, IMAGE_SIZES } from '@/utils/imageUtils';
import { supabase } from '@/lib/supabase';

interface BlogPost {
  id?: number;
  title: string;
  content: string;
  description: string;
  image_url?: string | null;
  slug?: string;
  is_draft?: boolean;
  created_at?: string;
}

const AdminBlog: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogPost, setBlogPost] = useState<BlogPost>({
    title: '',
    content: '',
    description: '',
    image_url: null
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Blog yazıları alınırken hata oluştu:', error);
      toast.error('Blog yazıları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlogPost(prev => ({ ...prev, [name]: value }));
  };

  const createSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleSave = async () => {
    if (!blogPost.title.trim()) {
      toast.error('Lütfen bir başlık girin');
      return;
    }

    if (!blogPost.content.trim()) {
      toast.error('Lütfen içerik girin');
      return;
    }

    setIsSaving(true);
    
    try {
      const slug = createSlug(blogPost.title);
      const blogData = {
        title: blogPost.title,
        content: blogPost.content,
        description: blogPost.description,
        image_url: blogPost.image_url,
        slug,
        is_draft: blogPost.is_draft || false
      };
      
      if (blogPost.id) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(blogData)
          .eq('id', blogPost.id);
          
        if (error) throw error;
        
        toast.success('Blog yazısı başarıyla güncellendi');
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert([blogData]);
          
        if (error) throw error;
        
        toast.success('Blog yazısı başarıyla oluşturuldu');
      }
      
      resetForm();
      fetchBlogPosts();
    } catch (error) {
      console.error('Blog yazısı kaydedilirken hata oluştu:', error);
      toast.error('Blog yazısı kaydedilirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setBlogPost({
      title: '',
      content: '',
      description: '',
      image_url: null,
      is_draft: false
    });
    setIsEditing(false);
  };

  const handleCreateBlog = () => {
    setBlogPost({
      title: 'Yeni Blog Yazısı',
      content: '',
      description: '',
      image_url: null,
      is_draft: false
    });
    setIsEditing(true);
  };

  const handleEditBlog = (post: BlogPost) => {
    setBlogPost({
      id: post.id,
      title: post.title,
      content: post.content,
      description: post.description || '',
      image_url: post.image_url,
      is_draft: post.is_draft || false,
      slug: post.slug,
      created_at: post.created_at
    });
    setIsEditing(true);
  };

  const handleDeleteBlog = async (id: number) => {
    if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Blog yazısı başarıyla silindi');
      fetchBlogPosts();
    } catch (error) {
      console.error('Blog yazısı silinirken hata oluştu:', error);
      toast.error('Blog yazısı silinirken bir hata oluştu');
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

      setIsUploading(true);
      // Show loading toast
      const loadingToast = toast.loading('Görsel yükleniyor...');

      const imageUrl = await uploadImage(file, 'blog-images');
      
      setBlogPost(prev => ({
        ...prev,
        image_url: imageUrl
      }));
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Görsel başarıyla yüklendi');
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      
      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('not authenticated')) {
          toast.error('Lütfen önce giriş yapın');
        } else if (error.message.includes('storage') || error.message.includes('bucket')) {
          toast.error('Storage hatası: Yönetici ile iletişime geçin');
        } else {
          toast.error(`Yükleme hatası: ${error.message}`);
        }
      } else {
        toast.error('Görsel yüklenirken bir hata oluştu');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setBlogPost(prev => ({
      ...prev,
      image_url: null
    }));
    toast.success('Görsel kaldırıldı');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Blog Yazıları</h1>
        
        {!isEditing && (
          <Button onClick={handleCreateBlog} className="flex items-center gap-2">
            <Plus size={20} />
            Yeni Blog Yazısı
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Blog Başlığı
            </label>
            <input
              type="text"
              name="title"
              value={blogPost.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
              placeholder="Blog başlığını girin..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Kısa Açıklama
            </label>
            <textarea
              name="description"
              value={blogPost.description}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
              placeholder="Blog yazısı için kısa bir açıklama girin..."
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-200">
                Kapak Görseli
              </label>
              <div className="flex gap-2">
                <label
                  className={`flex items-center gap-2 px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Upload size={14} />
                  Görsel Yükle
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const url = window.prompt('Görsel URL\'si:');
                    if (url) setBlogPost(prev => ({ ...prev, image_url: url }));
                  }}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
                  disabled={isUploading}
                >
                  <ImageIcon size={14} />
                  URL ile Ekle
                </button>
              </div>
            </div>
            {blogPost.image_url && (
              <div className="mt-2 relative">
                <div 
                  className="relative rounded-lg overflow-hidden bg-zinc-800"
                  style={{ 
                    aspectRatio: `${IMAGE_SIZES.cover.width}/${IMAGE_SIZES.cover.height}`,
                    maxHeight: '300px'
                  }}
                >
                  <img
                    src={blogPost.image_url}
                    alt="Kapak görseli"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white/80 hover:text-white rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Önerilen görsel boyutu: {IMAGE_SIZES.cover.width}x{IMAGE_SIZES.cover.height} piksel
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              İçerik
            </label>
            <ProjectEditor
              content={blogPost.content}
              onChange={(content) => setBlogPost(prev => ({ ...prev, content }))}
            />
          </div>



          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isDraft"
              checked={blogPost.is_draft}
              onChange={(e) => setBlogPost(prev => ({ ...prev, is_draft: e.target.checked }))}
              className="mr-2 h-4 w-4 rounded border-gray-700 bg-gray-800 text-blue-600"
            />
            <label htmlFor="isDraft" className="text-sm text-gray-200">
              Taslak olarak kaydet (yayınlanmayacak)
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={isSaving || isUploading}
            >
              İptal
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || isUploading}
              className="flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : blogPosts.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center py-12">
          <p className="text-zinc-400 mb-6">Henüz hiç blog yazısı bulunmuyor.</p>
          <Button onClick={handleCreateBlog} className="flex items-center gap-2 mx-auto">
            <Plus size={20} />
            Yeni Blog Yazısı Oluştur
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map(post => (
            <div
              key={post.id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-800/50 transition-colors"
            >
              <div className="aspect-video w-full overflow-hidden bg-zinc-800">
                {post.image_url ? (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">
                    Görsel Yok
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                  {post.is_draft && (
                    <span className="px-2 py-1 bg-yellow-900/30 text-yellow-300 border border-yellow-700 rounded-md text-xs">
                      Taslak
                    </span>
                  )}
                </div>
                
                {post.description && (
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{post.description}</p>
                )}
                

                
                <div className="text-xs text-gray-500 mb-4">
                  {post.created_at && formatDate(post.created_at)}
                </div>
                
                <div className="flex justify-end gap-2">
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-zinc-400 hover:text-zinc-100 transition-colors"
                    title="Görüntüle"
                  >
                    <Eye size={16} />
                  </a>
                  <button
                    onClick={() => handleEditBlog(post)}
                    className="p-1.5 text-zinc-400 hover:text-blue-400 transition-colors"
                    title="Düzenle"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(post.id as number)}
                    className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors"
                    title="Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlog; 