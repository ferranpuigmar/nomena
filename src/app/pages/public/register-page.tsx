import { Navigate } from 'react-router-dom';
import { RegisterForm } from '@src/features/auth/components/register-form';
import { useAuthStore } from '@src/features/auth/store/auth-store';
import { ROUTES } from '@src/app/router';

export function RegisterPage() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.home.path} replace />;
  }

  return <RegisterForm />;
}
