import Header from '../components/header/header'
import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../../../features/auth/store/auth-store'
import { AuthHeaderControls } from '../../../features/auth/components/auth-header-controls'
import { NAMES_NAV_ITEMS } from '../../../features/names/navigation/names-nav-items'
import { getFavoritesNavItems } from '../../../features/favorites/navigation/favorites-nav-items'
import { selectedFavoritesCount, useFavoritesStore } from '../../../features/favorites/store/favorites-store'
import { useFavoritesStoreSyncByUserId } from '../../../features/favorites/hooks/use-favorites'
import { ACCOUNT_NAV_ITEMS } from '../../../features/account/navigation/account-nav-items'

export const BaseLayout = () => {
  const isAuthReady = useAuthStore((state) => state.isAuthReady)
  const userId = useAuthStore((state) => state.user?.uid)
  useFavoritesStoreSyncByUserId(userId)
  const favoritesCount = useFavoritesStore(selectedFavoritesCount)
  const appNavItems = [...NAMES_NAV_ITEMS, ...getFavoritesNavItems(favoritesCount), ...ACCOUNT_NAV_ITEMS]

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header menuItems={appNavItems} actions={<AuthHeaderControls />} />
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
