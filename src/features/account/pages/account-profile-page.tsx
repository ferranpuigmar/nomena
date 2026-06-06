import { useAuthStore } from '@src/features/auth/store/auth-store'
import { AvatarUpload } from '@src/features/auth/components/avatar-upload'
import { Mail, Lock } from 'lucide-react'

export const AccountProfilePage = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-[28px] font-heading font-semibold text-neutral-900">Tu perfil</h1>
        <p className="text-[15px] text-neutral-600">Gestiona la información de tu cuenta</p>
      </div>

      {/* Avatar Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex items-center gap-5">
        <div className="shrink-0">
          <AvatarUpload />
        </div>
        <div className="space-y-2 flex-1">
          <p className="text-base font-medium text-neutral-900">{user?.email ?? 'Sin email'}</p>
          <p className="text-[13px] text-neutral-500">
            Miembro desde {user?.metadata?.creationTime 
              ? new Date(user.metadata.creationTime).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
              : 'hace poco'}
          </p>
        </div>
      </div>

      {/* Email Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
        {/* Header with icon */}
        <div className="flex items-center gap-3">
          <Mail size={20} className="text-accent-primary" />
          <h2 className="text-lg font-heading font-semibold text-neutral-900">
            Correo electrónico
          </h2>
        </div>

        {/* Input */}
        <div className="space-y-2.5">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-600">
            Dirección de email
          </label>
          <input
            id="email"
            type="email"
            value={user?.email ?? ''}
            disabled
            className="w-full h-12 px-4 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:border-accent-primary transition disabled:bg-neutral-50 disabled:text-neutral-500"
          />
        </div>

        {/* Button */}
        <button
          disabled
          className="px-5 h-10 bg-accent-primary text-white text-sm font-medium rounded-lg hover:bg-accent-primary/90 disabled:opacity-50 transition"
        >
          Actualizar email
        </button>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
        {/* Header with icon */}
        <div className="flex items-center gap-3">
          <Lock size={20} className="text-accent-primary" />
          <h2 className="text-lg font-heading font-semibold text-neutral-900">
            Contraseña
          </h2>
        </div>

        {/* Current Password Input */}
        <div className="space-y-2.5">
          <label htmlFor="current-password" className="block text-sm font-medium text-neutral-600">
            Contraseña actual
          </label>
          <input
            id="current-password"
            type="password"
            placeholder="••••••••"
            disabled
            className="w-full h-12 px-4 bg-white border border-neutral-300 rounded-lg text-sm placeholder:text-neutral-900 focus:outline-none focus:border-accent-primary transition disabled:bg-neutral-50"
          />
        </div>

        {/* New Password Input */}
        <div className="space-y-2.5">
          <label htmlFor="new-password" className="block text-sm font-medium text-neutral-600">
            Nueva contraseña
          </label>
          <input
            id="new-password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            disabled
            className="w-full h-12 px-4 bg-white border border-neutral-300 rounded-lg text-sm placeholder:text-neutral-500 focus:outline-none focus:border-accent-primary transition disabled:bg-neutral-50"
          />
        </div>

        {/* Button */}
        <button
          disabled
          className="px-5 h-10 bg-accent-primary text-white text-sm font-medium rounded-lg hover:bg-accent-primary/90 disabled:opacity-50 transition"
        >
          Cambiar contraseña
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-[#D95C5C33] p-6 flex items-center gap-4">
        <div className="flex-1 space-y-0.5">
          <p className="text-[15px] font-semibold text-[#D95C5C]">Eliminar cuenta</p>
          <p className="text-[13px] text-neutral-600">
            Esta acción es irreversible. Se eliminarán todos tus datos y favoritos.
          </p>
        </div>
        <button
          className="shrink-0 px-5 h-10 border border-[#D95C5C] text-[#D95C5C] text-sm font-medium rounded-lg hover:bg-[#D95C5C] hover:text-white transition"
        >
          Eliminar
        </button>
      </div>
    </section>
  )
}
