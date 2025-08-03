import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense, memo } from 'react';
import { injectSpeedInsights } from '@vercel/speed-insights';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { ADMIN_URLS } from './lib/constants';

// Lazy loading için sayfa import'ları
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminAbout = lazy(() => import('./pages/admin/AdminAbout'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminContact = lazy(() => import('./pages/admin/AdminContact'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

// Optimized loading component
const LoadingSpinner = memo(() => (
  <div 
    className="flex items-center justify-center min-h-screen bg-black"
    style={{
      willChange: 'auto',
      containIntrinsicSize: '100vw 100vh'
    }}
  >
    <div 
      className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-400"
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)'
      }}
    />
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Speed Insights wrapper - memoized
const SpeedInsightsWrapper = memo(() => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    return <>{injectSpeedInsights()}</>;
  }
  return null;
});

SpeedInsightsWrapper.displayName = 'SpeedInsightsWrapper';

function App() {
  return (
    <HelmetProvider>
      <div className="dark">
        <Toaster 
          richColors 
          position="top-right" 
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgb(17 24 39)',
              border: '1px solid rgb(55 65 81)',
              color: 'rgb(243 244 246)'
            }
          }}
        />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="contact" element={<AdminContact />} />
            </Route>

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        
        {/* Vercel Speed Insights - Optimized */}
        <SpeedInsightsWrapper />
      </div>
    </HelmetProvider>
  );
}

export default App;