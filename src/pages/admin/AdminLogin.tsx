import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import { sanitizeForSQL } from '../../utils/validation';
import AdminMetaTags from '../../components/AdminMetaTags';
import { ADMIN_URLS } from '../../lib/constants';

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    // Sadece submit/blur doğrulaması; ekstra güvenlik katmanlarını kullanma
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Oturum kontrolü için otomatik yönlendirmeyi kaldırdık.

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // Sadece SQL enjeksiyonu için temel temizleme (client-side)
      const email = sanitizeForSQL(data.email);
      const password = data.password; // Parolayı değiştirmeyelim

      const { error } = await signIn(email, password);
      
      if (error) {
        setError('Giriş başarısız. E-posta veya şifre hatalı.');
      } else {
        navigate(ADMIN_URLS.DASHBOARD, { replace: true });
      }
          } catch (err) {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminMetaTags title="Admin Girişi" description="Site yönetimi girişi" />
      <div className="min-h-screen bg-black flex items-center justify-center relative z-10">
        <div className="w-full max-w-md p-6 bg-zinc-900 rounded-lg border border-zinc-800 relative z-10" onClick={(e) => e.stopPropagation()}>
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Girişi</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              autoFocus
              autoComplete="email"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 pointer-events-auto"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              autoComplete="current-password"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 pointer-events-auto"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-500"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-zinc-300">
              Beni hatırla
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

      </div>
    </div>
    </>
  );
};

export default AdminLogin; 
