-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  location TEXT NOT NULL DEFAULT 'San Francisco, CA',
  timezone TEXT NOT NULL DEFAULT 'PST (UTC-8)',
  availability_status TEXT NOT NULL DEFAULT 'Available for Projects',
  availability_description TEXT NOT NULL DEFAULT 'I''m currently accepting new projects and collaborations. Feel free to reach out to discuss your ideas!',
  contact_description TEXT NOT NULL DEFAULT 'I''m always excited to discuss new projects, creative ideas, or opportunities to be part of your vision. Whether you need a complete web application, want to integrate AI into your existing systems, or are looking for a technical co-founder, I''d love to hear from you.',
  services_list TEXT[] NOT NULL DEFAULT ARRAY[
    'Full-stack web development',
    'AI/ML integration and consulting',
    'Technical architecture and system design',
    'Code reviews and mentoring',
    'Startup technical advisory'
  ],
  preferred_contact_method TEXT NOT NULL DEFAULT 'Email is the best way to reach me for detailed discussions. I typically respond within 24 hours on weekdays.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON contact_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read projects
CREATE POLICY "Allow public read access" ON projects
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to read contact_info
CREATE POLICY "Allow public read access" ON contact_info
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert projects
CREATE POLICY "Allow authenticated users to insert" ON projects
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert contact_info
CREATE POLICY "Allow authenticated users to insert" ON contact_info
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update their own projects
CREATE POLICY "Allow authenticated users to update" ON projects
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update contact_info
CREATE POLICY "Allow authenticated users to update" ON contact_info
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete their own projects
CREATE POLICY "Allow authenticated users to delete" ON projects
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete contact_info
CREATE POLICY "Allow authenticated users to delete" ON contact_info
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert default contact info if not exists
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