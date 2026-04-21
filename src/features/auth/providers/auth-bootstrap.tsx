import { useEffect } from 'react';
import { useAuthStore } from '../store/auth-store';

export function AuthBootstrap() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const cleanupAuthListener = useAuthStore((state) => state.cleanupAuthListener);

  useEffect(() => {
    initializeAuth();

    return () => {
      cleanupAuthListener();
    };
  }, [initializeAuth, cleanupAuthListener]);

  return null;
}
