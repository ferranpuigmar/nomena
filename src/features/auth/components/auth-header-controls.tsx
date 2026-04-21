import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth-store'

export const AuthHeaderControls = () => {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-gray-600">{user?.email}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <NavLink
      to="/login"
      className="px-4 py-2 rounded-lg bg-purple-600 text-white transition hover:bg-purple-700"
    >
      Login
    </NavLink>
  )
}
