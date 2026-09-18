# Portfolio Website

Modern, responsive portfolio website built with React, TypeScript, and Supabase.

## 🚀 Features

- **Modern Tech Stack**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Admin Panel**: Secure admin interface with Supabase Auth
- **Blog Management**: Full CRUD operations for blog posts
- **Project Management**: Complete project showcase with image upload
- **Contact Form**: Interactive contact system
- **SEO Optimized**: Meta tags and Open Graph support
- **Responsive Design**: Mobile-first approach

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.2** - Build tool
- **Tailwind CSS 3.4.1** - Styling
- **Framer Motion 12.23.7** - Animations
- **React Router DOM 7.7.0** - Routing

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Storage (for images)
  - Row Level Security (RLS)

### UI Components
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **TipTap** - Rich text editor
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/          # Admin panel components
│   ├── ui/            # Reusable UI components
│   └── ...            # Other components
├── pages/             # Page components
├── lib/               # Utilities and configurations
├── hooks/             # Custom React hooks
├── data/              # Static data
└── utils/             # Helper functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AlgoWolfx/portfoliomben.git
   cd portfoliomben
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   
   # Add your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_SECRET_PATH=your_admin_secret_path
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the SQL schema from `schema.sql`
3. Configure RLS policies
4. Set up storage buckets for images

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_SECRET_PATH=your_admin_secret_path
```

## 📱 Features

### Public Pages
- **Home**: Landing page with hero section
- **About**: Personal information and skills
- **Projects**: Portfolio showcase
- **Blog**: Articles and posts
- **Contact**: Contact form and information

### Admin Panel
- **Dashboard**: Overview and statistics
- **Projects**: CRUD operations for projects
- **Blog**: Content management
- **Profile**: Personal information editing
- **Messages**: Contact form submissions

## 🔒 Security

- **Row Level Security (RLS)**: Database-level security
- **Authentication**: Supabase Auth integration
- **Environment Variables**: Secure credential management
- **Input Validation**: Zod schema validation
- **XSS Protection**: DOMPurify integration

## 🎨 Design

- **Dark Theme**: Muted dark color palette
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions with Framer Motion
- **Accessibility**: ARIA labels and keyboard navigation

## 📊 Performance

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Automatic optimization
- **Bundle Analysis**: Vite build analysis
- **Lighthouse**: Performance monitoring

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically

### Other Platforms
- Netlify
- Railway
- Render

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

- **GitHub**: [@AlgoWolfx](https://github.com/AlgoWolfx)
- **Portfolio**: [Live Site](https://algowolf.vercel.app)

---

Built with ❤️ using React, TypeScript, and Supabase 