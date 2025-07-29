import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export type ProfileData = {
  id?: number;
  name: string;
  title: string;
  about: string;
  email: string;
  avatar_url: string | null;
  social_links: {
    linkedin: string;
    github: string;
    twitter: string;
    instagram: string;
  };
  skills: string[];
};

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single();

      if (error) throw error;
      setProfile(data);
      // Profil verisi yüklendi
    } catch (err) {
      // Profil verisi alınırken hata
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (newData: Partial<ProfileData>) => {
    try {
      setLoading(true);
      
      // Profil verisi yoksa yeni oluştur
      if (!profile || !profile.id) {
        // Profil verisi bulunamadı, yeni profil oluşturuluyor
        const { error: insertError } = await supabase
          .from('profile')
          .insert([newData])
          .select();
          
        if (insertError) throw insertError;
        
        // Profil verisini yenile
        await fetchProfile();
        return { success: true, error: null };
      }
      
      // Mevcut profili güncelle
      // Profil güncelleniyor, ID: profile.id
      const { error } = await supabase
        .from('profile')
        .update(newData)
        .eq('id', profile.id);

      if (error) throw error;
      
      // Refresh profile data after update
      await fetchProfile();
      return { success: true, error: null };
    } catch (err) {
      // Profil güncellenirken hata
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile
  };
}; 