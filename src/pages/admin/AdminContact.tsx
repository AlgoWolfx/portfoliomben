import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { useContactInfo, type ContactInfoData } from '../../lib/hooks/useContactInfo';

const AdminContact = () => {
  const { contactInfo, loading, updateContactInfo } = useContactInfo();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ContactInfoData>({
    location: '',
    timezone: '',
    availability_status: '',
    availability_description: '',
    contact_description: '',
    services_list: [],
    preferred_contact_method: ''
  });
  const [newService, setNewService] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Form verilerini contactInfo ile doldur
  React.useEffect(() => {
    if (contactInfo) {
      setFormData(contactInfo);
    } else {
      // Varsayılan değerler
      setFormData({
        location: 'San Francisco, CA',
        timezone: 'PST (UTC-8)',
        availability_status: 'Available for Projects',
        availability_description: 'I\'m currently accepting new projects and collaborations. Feel free to reach out to discuss your ideas!',
        contact_description: 'I\'m always excited to discuss new projects, creative ideas, or opportunities to be part of your vision. Whether you need a complete web application, want to integrate AI into your existing systems, or are looking for a technical co-founder, I\'d love to hear from you.',
        services_list: [
          'Full-stack web development',
          'AI/ML integration and consulting',
          'Technical architecture and system design',
          'Code reviews and mentoring',
          'Startup technical advisory'
        ],
        preferred_contact_method: 'Email is the best way to reach me for detailed discussions. I typically respond within 24 hours on weekdays.'
      });
    }
  }, [contactInfo]);

  const handleInputChange = (field: keyof ContactInfoData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddService = () => {
    if (newService.trim() && !formData.services_list.includes(newService.trim())) {
      handleInputChange('services_list', [...formData.services_list, newService.trim()]);
      setNewService('');
    }
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = formData.services_list.filter((_, i) => i !== index);
    handleInputChange('services_list', updatedServices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await updateContactInfo(formData);
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Contact bilgileri başarıyla güncellendi.'
        });
        setIsEditing(false);
      } else {
        setNotification({
          type: 'error',
          message: result.error?.message || 'Contact bilgileri güncellenirken bir hata oluştu.'
        });
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Bir hata oluştu.'
      });
    }

    // 3 saniye sonra bildirimi kaldır
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contact Bilgileri</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Düzenle
          </button>
        )}
      </div>

      {notification && (
        <div className={`mb-6 p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-200' : 'bg-red-900/30 border border-red-700 text-red-200'
        }`}>
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location ve Timezone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Konum
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Zaman Dilimi
            </label>
            <input
              type="text"
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Availability Status */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Mevcut Durum
          </label>
          <input
            type="text"
            value={formData.availability_status}
            onChange={(e) => handleInputChange('availability_status', e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        {/* Availability Description */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Durum Açıklaması
          </label>
          <textarea
            value={formData.availability_description}
            onChange={(e) => handleInputChange('availability_description', e.target.value)}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 resize-none"
          />
        </div>

        {/* Contact Description */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            İletişim Açıklaması
          </label>
          <textarea
            value={formData.contact_description}
            onChange={(e) => handleInputChange('contact_description', e.target.value)}
            disabled={!isEditing}
            rows={4}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 resize-none"
          />
        </div>

        {/* Services List */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Hizmetler Listesi
          </label>
          <div className="space-y-3">
            {formData.services_list.map((service, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white">
                  {service}
                </span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveService(index)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder="Yeni hizmet ekle..."
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Tercih Edilen İletişim Yöntemi
          </label>
          <textarea
            value={formData.preferred_contact_method}
            onChange={(e) => handleInputChange('preferred_contact_method', e.target.value)}
            disabled={!isEditing}
            rows={3}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 resize-none"
          />
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex justify-end space-x-4 pt-6 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                if (contactInfo) {
                  setFormData(contactInfo);
                }
              }}
              className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Kaydet</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminContact; 