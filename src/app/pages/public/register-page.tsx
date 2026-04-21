import { Navigate } from 'react-router-dom';
import { RegisterForm } from '../../../features/auth/components/register-form';
import { useAuthStore } from '../../../features/auth/store/auth-store';

export function RegisterPage() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <RegisterForm />;
}
