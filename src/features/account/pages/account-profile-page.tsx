import { useAuthStore } from '@src/features/auth/store/auth-store'

export const AccountProfilePage = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <section>
      <h1 className="text-2xl font-semibold text-gray-900">Perfil</h1>
      <p className="mt-2 text-gray-600">Gestiona tus datos de acceso y preferencias de cuenta.</p>

      <div className="mt-6 space-y-4">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Email actual</p>
          <p className="mt-1 text-base font-medium text-gray-900">{user?.email ?? 'Sin email'}</p>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-900">Seguridad</h2>
          <p className="mt-2 text-sm text-gray-600">
            Aqui puedes anadir formularios para cambiar email y password cuando implementes los endpoints.
          </p>
        </div>
      </div>
    </section>
  )
}
