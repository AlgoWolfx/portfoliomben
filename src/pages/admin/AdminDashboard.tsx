import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  blogCount: number;
  projectCount: number;
  messageCount: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    blogCount: 0,
    projectCount: 0,
    messageCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      try {
        // Blog sayısını al
        const { count: blogCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true });
        
        // Proje sayısını al
        const { count: projectCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });
        
        // Mesaj sayısını al
        const { count: messageCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true });
        
        setStats({
          blogCount: blogCount || 0,
          projectCount: projectCount || 0,
          messageCount: messageCount || 0,
        });
          } catch {
      // İstatistikler alınırken hata oluştu
    } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kontrol Paneli</h1>
      
      {loading ? (
        <div className="text-center py-8">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-zinc-400 mb-2">Blog Yazıları</h2>
            <p className="text-3xl font-bold">{stats.blogCount}</p>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-zinc-400 mb-2">Projeler</h2>
            <p className="text-3xl font-bold">{stats.projectCount}</p>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-zinc-400 mb-2">Mesajlar</h2>
            <p className="text-3xl font-bold">{stats.messageCount}</p>
          </div>
        </div>
      )}
      

    </div>
  );
};

export default AdminDashboard; 