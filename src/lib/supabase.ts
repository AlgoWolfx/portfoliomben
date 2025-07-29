import { createClient } from '@supabase/supabase-js';

// Environment variables güvenlik kontrolü
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Production'da ek güvenlik kontrolleri
if (import.meta.env.PROD) {
  // Production'da console.log'ları kapat
  console.log = () => {};
  
  // Environment variables'ları client-side'da expose etme
  if (typeof window !== 'undefined') {
    // Client-side'da sadece gerekli değişkenleri kullan
    console.warn = () => {};
    console.error = () => {};
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  github_url?: string;
  live_url?: string;
  technologies: string[];
  created_at: string;
  updated_at: string;
}

function cleanText(text: string): string {
  if (!text) return '';
  
  // First remove HTML tags
  let cleanedText = text.replace(/<[^>]+>/g, '');
  
  // Then decode HTML entities
  const textarea = document.createElement('textarea');
  textarea.innerHTML = cleanedText;
  cleanedText = textarea.value;
  
  // Remove any remaining HTML-like characters and extra spaces
  cleanedText = cleanedText
    .replace(/&[^;]+;/g, '') // Remove any remaining HTML entities
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim(); // Remove leading/trailing spaces
    
  return cleanedText;
}

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  return data.map(project => ({
    ...project,
    description: cleanText(project.description),
    title: cleanText(project.title)
  }));
};

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export const getProjectById = async (id: string): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Project not found');
  }

  return {
    ...data,
    description: cleanText(data.description),
    title: cleanText(data.title)
  };
};

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
  try {
    // Ensure technologies is an array
    const technologies = Array.isArray(project.technologies) ? project.technologies : [];
    
    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title: project.title,
        description: project.description,
        image_url: project.image_url || null,
        github_url: project.github_url || null,
        live_url: project.live_url || null,
        technologies: technologies
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from insert');
    }

    return data;
  } catch (error) {
    console.error('Error in createProject:', error);
    throw error;
  }
}

export async function updateProject(id: string, project: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function uploadProjectImage(file: File): Promise<string> {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get the public URL
    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName);

    if (!data.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadProjectImage:', error);
    throw error;
  }
} 