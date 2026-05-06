import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth-store'
import { Button } from '@src/app/shared/components/button/button'
import { ROUTES } from '@src/app/router'
import { useFavoritesStore } from '@src/features/favorites/store/favorites-store'
import HearthIcon from '@src/assets/icons/hearth.svg?react'
import { UserMenu } from './user-menu'

export const AuthHeaderControls = () => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { favorites } = useFavoritesStore()
  const navigate = useNavigate()

  const favoritesCount = favorites?.names?.length

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.home.path)
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        {!!favoritesCount && (
          <div className='flex items-center'>
            <span className="text-sm text-gray-600"><HearthIcon className="size-4 text-accent-primary" /></span>
            <span className="ml-1 text-sm font-medium text-accent-primary">{favoritesCount}</span>
          </div>
        )}
        <UserMenu user={user} onLogout={handleLogout} />
      </div>
    )
  }

  return <div className='flex gap-2'><Button to={ROUTES.login.path}>Login</Button> <Button variant={'ghost'} to={ROUTES.register.path}>Register</Button></div>
}
