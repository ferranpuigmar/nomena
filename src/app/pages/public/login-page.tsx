import { Navigate } from 'react-router-dom';
import { LoginForm } from '../../../features/auth/components/login-form';
import { useAuthStore } from '../../../features/auth/store/auth-store';

export function LoginPage() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <LoginForm />;
}
