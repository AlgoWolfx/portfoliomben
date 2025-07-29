import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, getSession } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLoginSchema } from '../../utils/validation';
import { useRateLimit } from '../../hooks/useRateLimit';
import { updateLastActivity, getSafeErrorMessage } from '../../lib/security';
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
  const { 
    canAttempt, 
    remainingAttempts, 
    recordFailedAttempt, 
    recordSuccessfulAttempt,
    getFormattedRemainingTime 
  } = useRateLimit();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await getSession();
      if (data.session) {
        navigate(ADMIN_URLS.DASHBOARD);
      }
    };

    checkSession();
  }, [navigate]);

  const onSubmit = async (data: LoginFormValues) => {
    // Rate limiting kontrolü
    if (!canAttempt) {
      setError(`Çok fazla başarısız deneme. ${getFormattedRemainingTime()} sonra tekrar deneyin.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {


      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        recordFailedAttempt();
        

        
        setError(`Giriş başarısız. E-posta veya şifre hatalı. Kalan deneme: ${remainingAttempts - 1}`);
      } else {
        recordSuccessfulAttempt();
        updateLastActivity();
        

        
        navigate(ADMIN_URLS.DASHBOARD);
      }
          } catch (err) {
        recordFailedAttempt();
        

        
        setError(getSafeErrorMessage(err));
      } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminMetaTags title="Admin Girişi" description="Site yönetimi girişi" />
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-zinc-900 rounded-lg border border-zinc-800">
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
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            disabled={loading || !canAttempt}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Giriş yapılıyor...' : !canAttempt ? `Bekleyin (${getFormattedRemainingTime()})` : 'Giriş Yap'}
          </button>
        </form>
        
        {/* Rate limiting bilgisi */}
        {remainingAttempts < 5 && (
          <div className="mt-4 p-3 bg-yellow-900/50 border border-yellow-700 text-yellow-200 rounded-md text-sm">
            Kalan deneme hakkı: {remainingAttempts}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default AdminLogin; 