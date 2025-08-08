import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

// Form şeması
const aboutSchema = z.object({
  story: z.string().min(10, 'Hikaye en az 10 karakter olmalıdır'),
  philosophy: z.string().min(10, 'Felsefe en az 10 karakter olmalıdır'),
  newFocus: z.string().optional(),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

const AdminAbout = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentFocus, setCurrentFocus] = useState<string[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
  });

  const newFocus = watch('newFocus');

  const fetchAboutData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('about_page')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        reset({
          story: data.story,
          philosophy: data.philosophy,
        });
        setCurrentFocus(data.current_focus || []);
      }
    } catch (error) {
      console.error('About sayfası verileri alınırken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchAboutData();
  }, [fetchAboutData]);

  const addFocus = () => {
    if (newFocus && newFocus.trim() !== '') {
      setCurrentFocus([...currentFocus, newFocus.trim()]);
      reset({ ...watch(), newFocus: '' });
    }
  };

  const removeFocus = (index: number) => {
    setCurrentFocus(currentFocus.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: AboutFormValues) => {
    setSaving(true);
    setNotification(null);

    try {
      const { error } = await supabase
        .from('about_page')
        .update({
          story: data.story,
          philosophy: data.philosophy,
          current_focus: currentFocus,
        })
        .eq('id', 1);

      if (error) throw error;

      setNotification({
        type: 'success',
        message: 'About sayfası başarıyla güncellendi.',
      });
    } catch (error) {
      console.error('About sayfası güncellenirken hata oluştu:', error);
      setNotification({
        type: 'error',
        message: 'About sayfası güncellenirken bir hata oluştu.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Yükleniyor...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">About Sayfası Yönetimi</h1>

      {notification && (
        <div className={`mb-6 p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-200' : 'bg-red-900/30 border border-red-700 text-red-200'
        }`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Hikaye</h2>
          <div>
            <textarea
              {...register('story')}
              rows={6}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Hikayenizi anlatın..."
            />
            {errors.story && (
              <p className="mt-1 text-sm text-red-400">{errors.story.message}</p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Felsefe</h2>
          <div>
            <textarea
              {...register('philosophy')}
              rows={6}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Çalışma felsefenizi anlatın..."
            />
            {errors.philosophy && (
              <p className="mt-1 text-sm text-red-400">{errors.philosophy.message}</p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Güncel Odak Noktaları</h2>
          
          <div className="space-y-4">
            {/* Mevcut odak noktaları */}
            <div className="space-y-2">
              {currentFocus.map((focus, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-zinc-800 rounded-md"
                >
                  <span className="text-gray-300">{focus}</span>
                  <button
                    type="button"
                    onClick={() => removeFocus(index)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Yeni odak noktası ekleme */}
            <div className="flex gap-2">
              <input
                type="text"
                {...register('newFocus')}
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Yeni odak noktası ekle..."
              />
              <button
                type="button"
                onClick={addFocus}
                disabled={!newFocus || newFocus.trim() === ''}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
              </button>
            </div>
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

export default AdminAbout; 