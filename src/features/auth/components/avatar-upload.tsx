import { useRef } from 'react'
import { useAuthStore } from '../store/auth-store'

export const AvatarUpload = () => {
  const { user, uploadAvatar, isLoading } = useAuthStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadAvatar(file)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={isLoading}
        onClick={() => inputRef.current?.click()}
        className="relative size-20 rounded-full overflow-hidden border-2 border-gray-300 hover:border-accent-primary transition-colors"
      >
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="Avatar" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center bg-gray-100 text-gray-400 text-sm">
            Foto
          </span>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs">
            ...
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
