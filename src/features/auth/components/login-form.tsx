import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/auth-store';
import { loginSchema, type LoginFormData } from '../schemas/auth-schemas';
import { ROUTES } from '@src/app/router';

export function LoginForm() {
  const { login } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError('root', { message });
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-neutral-900 font-heading">Bienvenido</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              className="w-full px-4 py-2 border border-neutral-400 rounded-lg focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary outline-none transition"
              {...register('email')}
            />
            {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-neutral-400 rounded-lg focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary outline-none transition"
              {...register('password')}
            />
            {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
          </div>

          {errors.root && (
            <div className="p-3 bg-error-light border border-error text-error rounded">
              {errors.root.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-accent-primary hover:bg-accent-primary-hover disabled:opacity-50 text-white font-medium rounded-lg transition"
          >
            {isSubmitting ? 'Cargando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral-600 text-sm">
            ¿No tienes cuenta?{' '}
            <Link to={ROUTES.register.path} className="text-accent-primary hover:text-accent-primary-hover font-medium">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
