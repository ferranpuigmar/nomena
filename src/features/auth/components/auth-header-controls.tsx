import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth-store'
import { Button } from '@src/app/shared/components/button/button'
import { ROUTES } from '@src/app/router'

export const AuthHeaderControls = () => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.home.path)
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Hola, <span className="font-medium text-gray-900">{user?.displayName ?? user?.email}</span>
        </span>
        <Button variant="danger" onClick={handleLogout}>Logout</Button>
      </div>
    )
  }

  return <Button to={ROUTES.login.path}>Login</Button>
}
