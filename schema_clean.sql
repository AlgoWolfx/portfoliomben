-- Contact info tablosu için RLS'yi devre dışı bırak
ALTER TABLE contact_info DISABLE ROW LEVEL SECURITY;

-- Varsayılan contact bilgilerini ekle (eğer yoksa)
INSERT INTO contact_info (location, timezone, availability_status, availability_description, contact_description, services_list, preferred_contact_method)
VALUES (
  'San Francisco, CA',
  'PST (UTC-8)',
  'Available for Projects',
  'I''m currently accepting new projects and collaborations. Feel free to reach out to discuss your ideas!',
  'I''m always excited to discuss new projects, creative ideas, or opportunities to be part of your vision. Whether you need a complete web application, want to integrate AI into your existing systems, or are looking for a technical co-founder, I''d love to hear from you.',
  ARRAY[
    'Full-stack web development',
    'AI/ML integration and consulting',
    'Technical architecture and system design',
    'Code reviews and mentoring',
    'Startup technical advisory'
  ],
  'Email is the best way to reach me for detailed discussions. I typically respond within 24 hours on weekdays.'
) ON CONFLICT DO NOTHING; 