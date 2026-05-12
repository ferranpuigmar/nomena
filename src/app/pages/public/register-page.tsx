import { Navigate } from 'react-router-dom';
import { RegisterForm } from '@src/features/auth/components/register-form';
import { useAuthStore } from '@src/features/auth/store/auth-store';
import { ROUTES } from '@src/app/router';
import { ContentWrapper } from '@src/app/shared/components/content-wrapper/content-wrapper';

export function RegisterPage() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.home.path} replace />;
  }

  return <ContentWrapper><RegisterForm /></ContentWrapper>;
}
