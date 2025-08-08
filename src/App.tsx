import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense } from 'react';
import { injectSpeedInsights } from '@vercel/speed-insights';
import ProtectedRoute from './components/ProtectedRoute';
import { ADMIN_URLS } from './lib/constants';

// Layout'ları lazy loading yap - sadece gerektiğinde yükle
const PublicLayout = lazy(() => import('./components/PublicLayout'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));

// Public sayfaları lazy loading
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));

// Admin sayfaları lazy loading - sadece admin route'larında yükle
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminAbout = lazy(() => import('./pages/admin/AdminAbout'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminContact = lazy(() => import('./pages/admin/AdminContact'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-400"></div>
  </div>
);

function App() {
  // Vercel Speed Insights - script injection (JSX'e render etmeyin)
  injectSpeedInsights();
  return (
    <HelmetProvider>
      <div className="dark">
        <Toaster richColors position="top-right" theme="dark" />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes - Sadece public layout yükle */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Decoy: /admin ve altları 404'a düşsün, gizli yolu ifşa etme */}
            <Route path="/admin/*" element={<NotFound />} />

            {/* Admin Routes - Sadece admin route'larında AdminLayout yükle */}
            <Route path={ADMIN_URLS.DASHBOARD} element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="contact" element={<AdminContact />} />
            </Route>

            {/* Admin Login - Ayrı route */}
            <Route path={ADMIN_URLS.LOGIN} element={<AdminLogin />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </HelmetProvider>
  );
}

export default App;