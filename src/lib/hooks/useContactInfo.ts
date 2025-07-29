import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export type ContactInfoData = {
  id?: number;
  location: string;
  timezone: string;
  availability_status: string;
  availability_description: string;
  contact_description: string;
  services_list: string[];
  preferred_contact_method: string;
};

export const useContactInfo = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .limit(1);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setContactInfo(data[0]);
      } else {
        setContactInfo(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      setContactInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const updateContactInfo = async (newData: Partial<ContactInfoData>) => {
    try {
      setLoading(true);
      
      // Önce mevcut veriyi kontrol et
      const { data: existingData, error: fetchError } = await supabase
        .from('contact_info')
        .select('*')
        .limit(1);

      if (fetchError) {
        throw fetchError;
      }

      let result;
      
      if (existingData && existingData.length > 0) {
        // Mevcut veriyi güncelle
        result = await supabase
          .from('contact_info')
          .update(newData)
          .eq('id', existingData[0].id)
          .select()
          .single();
      } else {
        // Yeni veri oluştur
        result = await supabase
          .from('contact_info')
          .insert([newData])
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      if (result.data) {
        setContactInfo(result.data);
      }
      
      return { success: true, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  return {
    contactInfo,
    loading,
    error,
    updateContactInfo,
    refreshContactInfo: fetchContactInfo
  };
}; 