import React, { useState, useEffect } from 'react';
import { Trash2, Mail, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setMessages(data || []);
    } catch {
      // Mesajlar alınırken hata oluştu
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Mesajı güncelle
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, is_read: true } : msg
      ));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: true });
      }
      
      setNotification({
        type: 'success',
        message: 'Mesaj okundu olarak işaretlendi.',
      });
    } catch {
      setNotification({
        type: 'error',
        message: 'Mesaj güncellenirken bir hata oluştu.',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Mesajı listeden kaldır
      setMessages(messages.filter(msg => msg.id !== id));
      
      // Eğer silinen mesaj seçili ise, seçimi kaldır
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      
      setNotification({
        type: 'success',
        message: 'Mesaj başarıyla silindi.',
      });
    } catch {
      setNotification({
        type: 'error',
        message: 'Mesaj silinirken bir hata oluştu.',
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mesajlar</h1>
      
      {notification && (
        <div className={`mb-6 p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-900/30 border border-green-700 text-green-200' : 'bg-red-900/30 border border-red-700 text-red-200'
        }`}>
          {notification.message}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">Yükleniyor...</div>
      ) : messages.length === 0 ? (
        <div className="text-center py-8 text-zinc-400">
          Henüz hiç mesaj bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mesaj Listesi */}
          <div className="md:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-zinc-800">
                <h2 className="font-medium">Gelen Mesajlar</h2>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {messages.map(message => (
                  <div 
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-3 border-b border-zinc-800 cursor-pointer hover:bg-zinc-800/50 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-zinc-800' : ''
                    } ${!message.is_read ? 'font-medium' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm truncate">{message.name}</span>
                      {!message.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 truncate mb-1">{message.email}</div>
                    <div className="text-xs text-zinc-500">{formatDate(message.created_at)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mesaj Detayı */}
          <div className="md:col-span-2">
            {selectedMessage ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">{selectedMessage.name}</h2>
                  
                  <div className="flex items-center space-x-2">
                    {!selectedMessage.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                        className="p-1.5 text-zinc-400 hover:text-green-400 transition-colors"
                        title="Okundu Olarak İşaretle"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="p-1.5 text-zinc-400 hover:text-blue-400 transition-colors"
                      title="E-posta Gönder"
                    >
                      <Mail size={16} />
                    </a>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors"
                      title="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-zinc-400 mb-1">Gönderen:</div>
                  <div className="flex items-center">
                    <span className="text-sm">{selectedMessage.email}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-zinc-400 mb-1">Tarih:</div>
                  <div className="text-sm">{formatDate(selectedMessage.created_at)}</div>
                </div>
                
                <div>
                  <div className="text-sm text-zinc-400 mb-2">Mesaj:</div>
                  <div className="bg-zinc-800 p-4 rounded-md whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex items-center justify-center h-full min-h-[200px]">
                <div className="text-center text-zinc-400">
                  <p>Mesaj detayını görüntülemek için bir mesaj seçin.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages; 