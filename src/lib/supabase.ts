import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These will be replaced with actual environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper functions for data operations
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('firebase_uid', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
}

export async function createUserProfile(userId: string, email: string, displayName: string | null) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      { 
        firebase_uid: userId,
        email,
        display_name: displayName || email.split('@')[0],
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
  
  return data;
}

export async function getUserProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user projects:', error);
    return [];
  }
  
  return data;
}

export async function getProject(projectId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  
  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }
  
  return data;
}

export async function saveProject(projectId: string, canvasState: any, name: string, userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .upsert([
      { 
        id: projectId,
        name,
        canvas_state: canvasState,
        user_id: userId,
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error saving project:', error);
    return null;
  }
  
  return data;
}

export async function createNewProject(name: string, userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .insert([
      { 
        name,
        canvas_state: { components: [] },
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating new project:', error);
    return null;
  }
  
  return data;
}

export async function deleteProject(projectId: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);
  
  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
  
  return true;
}

export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    console.error('Error fetching subscription:', error);
    return null;
  }
  
  return data;
}