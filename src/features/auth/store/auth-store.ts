import { create } from 'zustand';
import { registerUser, loginUser, signOut, onAuthChange, uploadAvatar, type AuthUser } from '../api';
import type { PendingAction } from '../types/auth-type';
import { withDevtools } from '@src/lib/zustand.ts';

let authUnsubscribe: (() => void) | null = null;

export interface AuthState {
  user: AuthUser | null;
  isAuthReady: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  pendingAction: PendingAction | null;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  setIsLoading: (loading: boolean) => void;
  initializeAuth: () => void;
  cleanupAuthListener: () => void;
  setPendingAction: (action: PendingAction | null) => void;
}

export const useAuthStore = create<AuthState>()(
  withDevtools('auth-store', (set) => {
    return {
    user: null,
    isAuthReady: false,
    isLoading: false,
    isAuthenticated: false,
    pendingAction: null,

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
        set({ user: null, isAuthenticated: false, isLoading: false, pendingAction: null });
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    setUser: (user) => {
      set({ user, isAuthenticated: !!user });
    },

    uploadAvatar: async (file: File) => {
      const { user } = useAuthStore.getState();
      if (!user) return;
      set({ isLoading: true });
      try {
        const url = await uploadAvatar(user.uid, file);
        set((state) => ({
          user: state.user ? { ...state.user, avatarUrl: url } : null,
          isLoading: false,
        }));
      } catch (error) {
        set({ isLoading: false });
        throw error;
      }
    },

    setIsLoading: (loading) => {
      set({ isLoading: loading });
    },

    setPendingAction: (action: PendingAction | null) => {
      set({ pendingAction: action });
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
  }),
);
