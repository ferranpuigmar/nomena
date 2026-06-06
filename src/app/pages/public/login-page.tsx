import { Navigate, useLocation } from 'react-router-dom';
import { LoginForm } from '@src/features/auth/components/login-form';
import { useAuthStore } from '@src/features/auth/store/auth-store';
import { ROUTES } from '@src/app/router';

export function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.search.path}
        state={{
          from: location,
        }}
        replace
      />
    );
  }

  return <LoginForm />;
}
