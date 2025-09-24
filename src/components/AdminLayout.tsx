import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { signOut } from '../lib/supabase';
import { LogOut, Home, User, FileText, Briefcase, MessageSquare, Info, Phone } from 'lucide-react';
import { checkSessionTimeout, updateLastActivity, secureLogout } from '../lib/security';
import AdminMetaTags from './AdminMetaTags';
import { ADMIN_URLS } from '../lib/constants';

const AdminLayout = () => {
  const [loading, setLoading] = useState(false);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const navigate = useNavigate();

  // ProtectedRoute zaten auth kontrolü yapıyor; burada sadece aktiviteyi güncel tut.
  useEffect(() => {
    updateLastActivity();
  }, []);

  // Session timeout kontrolü - her 5 dakikada bir kontrol et
  useEffect(() => {
    const sessionCheckInterval = setInterval(() => {
      if (checkSessionTimeout()) {
        setShowTimeoutWarning(true);
        setTimeout(async () => {
          secureLogout();
          navigate(ADMIN_URLS.LOGIN);
        }, 30000); // 30 saniye uyarı
      }
    }, 5 * 60 * 1000); // 5 dakika

    // Aktivite dinleyicileri
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      updateLastActivity();
      setShowTimeoutWarning(false);
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    return () => {
      clearInterval(sessionCheckInterval);
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [navigate]);

  const handleLogout = async () => {
    await secureLogout();
    await signOut();
    navigate(ADMIN_URLS.LOGIN);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <>
      <AdminMetaTags title="Admin Panel" description="Site yönetimi" />
      
      {/* Session timeout uyarısı */}
      {showTimeoutWarning && (
        <div className="fixed top-4 right-4 z-50 bg-red-900/90 border border-red-700 text-red-200 p-4 rounded-md shadow-lg">
          <div className="font-semibold mb-2">Oturum Süresi Doluyor</div>
          <div className="text-sm">30 saniye içinde otomatik olarak çıkış yapılacaksınız.</div>
          <button 
            onClick={() => setShowTimeoutWarning(false)}
            className="mt-2 text-xs bg-red-700 hover:bg-red-600 px-2 py-1 rounded"
          >
            Uyarıyı Kapat
          </button>
        </div>
      )}
      
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
                to={ADMIN_URLS.DASHBOARD}
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <Home size={18} />
                <span>Ana Panel</span>
              </Link>
            </li>
            <li>
              <Link 
                to={`${ADMIN_URLS.DASHBOARD}/profile`}
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <User size={18} />
                <span>Profil</span>
              </Link>
            </li>
            <li>
              <Link 
                to={`${ADMIN_URLS.DASHBOARD}/about`}
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <Info size={18} />
                <span>Hakkımda</span>
              </Link>
            </li>
            <li>
              <Link 
                to={`${ADMIN_URLS.DASHBOARD}/blog`}
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <FileText size={18} />
                <span>Blog</span>
              </Link>
            </li>
            <li>
              <Link 
                to={`${ADMIN_URLS.DASHBOARD}/projects`}
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <Briefcase size={18} />
                <span>Projeler</span>
              </Link>
            </li>
            <li>
              <Link 
                to={`${ADMIN_URLS.DASHBOARD}/messages`}
                className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <MessageSquare size={18} />
                <span>Mesajlar</span>
              </Link>
            </li>
            <li>
              <Link 
                to={`${ADMIN_URLS.DASHBOARD}/contact`}
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
    </>
  );
};

export default AdminLayout; 
