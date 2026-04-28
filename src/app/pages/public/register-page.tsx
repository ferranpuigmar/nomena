import { Navigate } from 'react-router-dom';
import { RegisterForm } from '@src/features/auth/components/register-form';
import { useAuthStore } from '@src/features/auth/store/auth-store';

export function RegisterPage() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <RegisterForm />;
}
