import { create } from 'zustand';
import { User } from 'firebase/auth';
import { onAuthChange } from '../lib/firebase';
import { getUserProfile, createUserProfile } from '../lib/supabase';

interface UserProfile {
  id: string;
  firebase_uid: string;
  email: string;
  display_name: string;
  subscription_tier: string | null;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setError: (error: string | null) => void;
  loadUserProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  error: null,
  initialized: false,
  
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setError: (error) => set({ error }),
  
  loadUserProfile: async () => {
    const { user } = get();
    
    if (!user) {
      set({ profile: null, isLoading: false });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      let profile = await getUserProfile(user.uid);
      
      if (!profile) {
        // Create a new profile if one doesn't exist
        profile = await createUserProfile(
          user.uid,
          user.email || '',
          user.displayName
        );
      }
      
      set({ profile, isLoading: false });
    } catch (error) {
      console.error('Error loading user profile:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load user profile',
        isLoading: false 
      });
    }
  }
}));

// Initialize auth state listener
export function initializeAuth() {
  const unsubscribe = onAuthChange(async (user) => {
    const { setUser, loadUserProfile } = useAuthStore.getState();
    
    setUser(user);
    
    if (user) {
      await loadUserProfile();
    }
    
    useAuthStore.setState({ initialized: true, isLoading: false });
  });
  
  return unsubscribe;
}