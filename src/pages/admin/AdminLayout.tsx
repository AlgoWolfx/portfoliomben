import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, signOut } from '../../lib/supabase';
import { LogOut, Home, User, FileText, Briefcase, MessageSquare, Info, Phone } from 'lucide-react';

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const { data, error } = await getCurrentUser();
      
      if (error || !data.user) {
        navigate('/admin/login');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sol menü */}
      <div className="w-64 bg-zinc-900 border-r border-zinc-800">
        <div className="p-4 border-b border-zinc-800">
          <h1 className="text-xl font-bold">Admin Paneli</h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/admin" 
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <Home size={18} />
                <span>Ana Panel</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/profile" 
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <User size={18} />
                <span>Profil</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/about" 
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <Info size={18} />
                <span>Hakkımda</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/blog" 
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <FileText size={18} />
                <span>Blog</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/projects" 
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <Briefcase size={18} />
                <span>Projeler</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/messages" 
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <MessageSquare size={18} />
                <span>Mesajlar</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/contact" 
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <Phone size={18} />
                <span>İletişim</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Sağ içerik */}
      <div className="flex-1 flex flex-col">
        {/* Üst bar */}
        <header className="h-14 border-b border-zinc-800 flex items-center justify-end px-6">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
            <span>Çıkış Yap</span>
          </button>
        </header>
        
        {/* İçerik alanı */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 