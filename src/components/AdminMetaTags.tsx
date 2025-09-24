import { Helmet } from 'react-helmet-async';

interface AdminMetaTagsProps {
  title?: string;
  description?: string;
}

const AdminMetaTags = ({ 
  title = "Admin Panel", 
  description = "Site yönetimi" 
}: AdminMetaTagsProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* Admin sayfaları için favicon'u data URL ile ayarla (ağ isteğini kes) */}
      <link
        rel="icon"
        type="image/png"
        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO93+N0AAAAASUVORK5CYII="
      />
      <link
        rel="shortcut icon"
        type="image/png"
        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO93+N0AAAAASUVORK5CYII="
      />
      
      {/* SEO indekslemesini engelleme */}
      <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
      <meta name="googlebot" content="noindex, nofollow" />
      <meta name="bingbot" content="noindex, nofollow" />
      
      {/* Cache kontrolü */}
      <meta name="cache-control" content="no-cache, no-store, must-revalidate" />
      <meta name="pragma" content="no-cache" />
      <meta name="expires" content="0" />
      
      {/* Güvenlik meta tag'leri */}
      <meta name="referrer" content="no-referrer" />
      
      {/* Open Graph tag'leri (admin sayfaları için) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:robots" content="noindex, nofollow" />
      
      {/* Twitter Card tag'leri */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:robots" content="noindex, nofollow" />
    </Helmet>
  );
};

export default AdminMetaTags; 
