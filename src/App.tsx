import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlog from './pages/admin/AdminBlog';
import AdminAbout from './pages/admin/AdminAbout';
import AdminProfile from './pages/admin/AdminProfile';
import AdminMessages from './pages/admin/AdminMessages';
import AdminContact from './pages/admin/AdminContact';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectDetail from './pages/ProjectDetail';

function App() {
  return (
    <HelmetProvider>
      <div className="dark">
        <Toaster richColors position="top-right" theme="dark" />
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

          {/* Admin Login - Özel URL'de gizli */}
          <Route path="/__q7r5t9m2v4b1/login" element={<AdminLogin />} />
          
          {/* Admin Panel - Gizli URL'de korumalı */}
          <Route path="/__q7r5t9m2v4b1" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="contact" element={<AdminContact />} />
          </Route>

          {/* Eski admin URL'leri için 404 - güvenlik için */}
          <Route path="/admin" element={<NotFound />} />
          <Route path="/admin/*" element={<NotFound />} />
          <Route path="/admin/login" element={<NotFound />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </HelmetProvider>
  );
}

export default App;