import { NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/auth-store'
import { useFavoritesStoreSyncByUserId } from '../../favorites/hooks/use-favorites'
import { selectedFavoritesCount, useFavoritesStore } from '../../favorites/store/favorites-store'

const AccountLayout = () => {
  const userId = useAuthStore((state) => state.user?.uid)
  useFavoritesStoreSyncByUserId(userId)
  const favoritesCount = useFavoritesStore(selectedFavoritesCount)

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm h-fit">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Cuenta</h2>
        <nav className="space-y-2">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              isActive
                ? 'block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white'
                : 'block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }
          >
            Perfil
          </NavLink>
          <NavLink
            to="favorites"
            className={({ isActive }) =>
              isActive
                ? 'block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white'
                : 'block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }
          >
            Favoritos ({favoritesCount})
          </NavLink>
        </nav>
      </aside>

      <main className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <Outlet />
      </main>
    </div>
  )
}

export default AccountLayout