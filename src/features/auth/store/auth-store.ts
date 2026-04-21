import { create } from 'zustand';
import { registerUser, loginUser, signOut, onAuthChange, type AuthUser } from '../api';

let authUnsubscribe: (() => void) | null = null;

export interface AuthState {
  user: AuthUser | null;
  isAuthReady: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  setIsLoading: (loading: boolean) => void;
  initializeAuth: () => void;
  cleanupAuthListener: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  return {
    user: null,
    isAuthReady: false,
    isLoading: false,
    isAuthenticated: false,

    register: async (email: string, password: string, displayName: string) => {
      set({ isLoading: true });
      try {
        const newUser = await registerUser(email, password, displayName);
        set({ user: newUser, isAuthenticated: true, isAuthReady: true, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    login: async (email: string, password: string) => {
      set({ isLoading: true });
      try {
        const authUser = await loginUser(email, password);
        set({ user: authUser, isAuthenticated: true, isAuthReady: true, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    logout: async () => {
      set({ isLoading: true });
      try {
        await signOut();
        set({ user: null, isAuthenticated: false, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    setUser: (user) => {
      set({ user, isAuthenticated: !!user });
    },

    setIsLoading: (loading) => {
      set({ isLoading: loading });
    },

    initializeAuth: () => {
      set({ isAuthReady: false });

      if (authUnsubscribe) {
        return;
      }

      authUnsubscribe = onAuthChange((authUser) => {
        set({
          user: authUser,
          isAuthReady: true,
          isAuthenticated: !!authUser,
        });
      });
    },

    cleanupAuthListener: () => {
      if (!authUnsubscribe) {
        return;
      }

      authUnsubscribe();
      authUnsubscribe = null;
    },
  };
});
