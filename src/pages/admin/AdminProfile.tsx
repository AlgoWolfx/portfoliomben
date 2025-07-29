import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfile } from '../../lib/hooks/useProfile';

// Form şeması
const profileSchema = z.object({
  name: z.string().min(1, 'İsim boş bırakılamaz'),
  title: z.string().min(1, 'Unvan boş bırakılamaz'),
  about: z.string().min(5, 'Hakkında metni en az 5 karakter olmalıdır'),
  email: z.string().email('Geçerli bir email adresi giriniz').or(z.literal('')),
  linkedin: z.string().url('Geçerli bir URL giriniz').or(z.literal('')),
  github: z.string().url('Geçerli bir URL giriniz').or(z.literal('')),
  twitter: z.string().url('Geçerli bir URL giriniz').or(z.literal('')),
  instagram: z.string().url('Geçerli bir URL giriniz').or(z.literal('')),
  skills: z.string().min(1, 'En az bir yetenek giriniz').or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const AdminProfile = () => {
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { profile, loading, updateProfile, refreshProfile } = useProfile();
  
  // Form için varsayılan değerler
  const defaultValues = {
    name: '',
    title: '',
    about: '',
    email: '',
    linkedin: '',
    github: '',
    twitter: '',
    instagram: '',
    skills: '',
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues
  });

  // Profil verisi geldiğinde form değerlerini güncelle
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        title: profile.title || '',
        about: profile.about || '',
        email: profile.email || '',
        linkedin: profile.social_links?.linkedin || '',
        github: profile.social_links?.github || '',
        twitter: profile.social_links?.twitter || '',
        instagram: profile.social_links?.instagram || '',
        skills: profile.skills?.join(', ') || '',
      });
    }
  }, [profile, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const uploadProfileImage = async (): Promise<string | null> => {
    if (!profileImage) return null;
    
    try {
      const fileExt = profileImage.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      
      // Önce eski görseli sil
      if (profile?.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          try {
            await supabase.storage
              .from('avatars')
              .remove([oldFileName]);
          } catch {
            // Eski görsel silinmese bile devam et
          }
        }
      }
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, profileImage);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: publicUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      return publicUrl.publicUrl;
    } catch {
      throw new Error('Görsel yüklenirken hata oluştu');
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setSaving(true);
    setNotification(null);
    
    try {
      let avatarUrl = null;
      if (profileImage) {
        avatarUrl = await uploadProfileImage();
      }
      
      const skills = data.skills
        ? data.skills
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill !== '')
        : [];
      
      const socialLinks = {
        linkedin: data.linkedin,
        github: data.github,
        twitter: data.twitter,
        instagram: data.instagram,
      };
      
      const result = await updateProfile({
        name: data.name,
        title: data.title,
        about: data.about,
        email: data.email,
        social_links: socialLinks,
        skills: skills,
        ...(avatarUrl && { avatar_url: avatarUrl }),
      });

      if (!result.success) {
        throw result.error;
      }
      
      // Profil verisini yenile
      await refreshProfile();
      
      setNotification({
        type: 'success',
        message: 'Profil başarıyla güncellendi.',
      });
      
      // Profil resmi seçimini sıfırla
      setProfileImage(null);
    } catch {
      setNotification({
        type: 'error',
        message: 'Profil güncellenirken bir hata oluştu.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profil Yönetimi</h1>
      
      {notification && (
        <div className={`mb-6 p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-200' : 'bg-red-900/30 border border-red-700 text-red-200'
        }`}>
          {notification.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Kişisel Bilgiler</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Profil Fotoğrafı
            </label>
            <div className="flex items-center space-x-4">
              {(profile?.avatar_url || profileImage) && (
                <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-800">
                  <img 
                    src={profileImage ? URL.createObjectURL(profileImage) : profile?.avatar_url || ''} 
                    alt="Profil" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <label className="cursor-pointer py-2 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors">
                {profileImage ? 'Görseli Değiştir' : 'Fotoğraf Seç'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {profileImage && (
                <button
                  type="button"
                  onClick={() => setProfileImage(null)}
                  className="py-2 px-4 bg-red-900/30 text-red-200 hover:bg-red-900/50 rounded-md transition-colors"
                >
                  Görseli Kaldır
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">
                İsim Soyisim
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-zinc-300 mb-1">
                Unvan / Pozisyon
              </label>
              <input
                id="title"
                type="text"
                {...register('title')}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="about" className="block text-sm font-medium text-zinc-300 mb-1">
              Hakkında
            </label>
            <textarea
              id="about"
              rows={5}
              {...register('about')}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.about && (
              <p className="mt-1 text-sm text-red-400">{errors.about.message}</p>
            )}
          </div>
          
          <div className="mt-4">
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
              E-posta Adresi
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Sosyal Medya</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-zinc-300 mb-1">
                LinkedIn
              </label>
              <input
                id="linkedin"
                type="text"
                placeholder="https://linkedin.com/in/username"
                {...register('linkedin')}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.linkedin && (
                <p className="mt-1 text-sm text-red-400">{errors.linkedin.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-zinc-300 mb-1">
                GitHub
              </label>
              <input
                id="github"
                type="text"
                placeholder="https://github.com/username"
                {...register('github')}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.github && (
                <p className="mt-1 text-sm text-red-400">{errors.github.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-zinc-300 mb-1">
                Twitter
              </label>
              <input
                id="twitter"
                type="text"
                placeholder="https://twitter.com/username"
                {...register('twitter')}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.twitter && (
                <p className="mt-1 text-sm text-red-400">{errors.twitter.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-zinc-300 mb-1">
                Instagram
              </label>
              <input
                id="instagram"
                type="text"
                placeholder="https://instagram.com/username"
                {...register('instagram')}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.instagram && (
                <p className="mt-1 text-sm text-red-400">{errors.instagram.message}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Yetenekler</h2>
          
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-zinc-300 mb-1">
              Yetenekler (virgülle ayırın)
            </label>
            <input
              id="skills"
              type="text"
              placeholder="React, TypeScript, Node.js, ..."
              {...register('skills')}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.skills && (
              <p className="mt-1 text-sm text-red-400">{errors.skills.message}</p>
            )}
            <p className="mt-1 text-sm text-zinc-500">
              Yeteneklerinizi virgülle ayırarak yazın (örn: React, TypeScript, Node.js)
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile; 