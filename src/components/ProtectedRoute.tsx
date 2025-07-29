import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getSession } from '../lib/supabase';
import { checkSessionTimeout, updateLastActivity } from '../lib/security';
import { ADMIN_URLS } from '../lib/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Session timeout kontrolü
        if (checkSessionTimeout()) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Son aktivite zamanını güncelle
        updateLastActivity();

        // Supabase session kontrolü
        const { data } = await getSession();
        
        if (data.session) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Loading durumunda spinner göster
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Yükleniyor...</div>
      </div>
    );
  }

  // Authenticated değilse login sayfasına yönlendir
  if (!isAuthenticated) {
    // Admin sayfaları için gizli URL'e yönlendir
    if (adminOnly) {
      return <Navigate to={ADMIN_URLS.LOGIN} replace />;
    }
    
    // Genel admin login sayfasına yönlendir
    return <Navigate to={ADMIN_URLS.LOGIN} replace />;
  }

  // Authenticated ise children'ı render et
  return <>{children}</>;
};

export default ProtectedRoute; 