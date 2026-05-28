import { useState, useRef, useEffect } from 'react'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react'
import { ROUTES } from '@src/app/router'
import ArrowDown from '@src/assets/icons/arrow-down.svg?react'
import type { AuthUser } from '../types/auth-type'
import { Button } from '@src/app/shared/components/button/button'

interface UserMenuProps {
  user: AuthUser
  onLogout: () => void
}

export const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setIsOpen(false), 100)
  }

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  return (
    <Menu as="div" className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <MenuButton className="flex gap-2 items-center cursor-pointer">
        <div className="size-8 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center text-sm font-medium text-gray-600">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="User Avatar" className="size-full object-cover" />
          ) : (
            (user.displayName?.charAt(0) ?? '?').toUpperCase()
          )}
        </div>
        {user.displayName && <span className="font-medium text-gray-900 capitalize">{user.displayName}</span>}
        <ArrowDown className={`size-3 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </MenuButton>
      <MenuItems static className={`absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none ${isOpen ? '' : 'hidden'}`}>
        <MenuItem>
          <Button variant={'link'} to={ROUTES.account.profile.path} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg" onClick={() => setIsOpen(false)}>
            Mi perfil
          </Button>
        </MenuItem>
        <div className="border-t border-gray-100" />
        <MenuItem>
          <Button variant="link"
            onClick={onLogout}
            className="block w-full px-4 py-2 text-left text-sm text-accent-secondary hover:text-accent-secondary-hover hover:bg-gray-50 rounded-b-lg"
          >
            Logout
          </Button>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}
