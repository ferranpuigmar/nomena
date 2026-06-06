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
  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <MenuButton className="flex gap-2 items-center cursor-pointer">
            <div className="size-8 rounded-full bg-neutral-200 overflow-hidden shrink-0 flex items-center justify-center text-sm font-medium text-neutral-600">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="User Avatar" className="size-full object-cover" />
              ) : (
                (user.displayName?.charAt(0) ?? '?').toUpperCase()
              )}
            </div>
            {user.displayName && <span className="font-medium text-neutral-900 capitalize">{user.displayName}</span>}
            <ArrowDown className={`size-3 text-neutral-600 transition-transform ${open ? 'rotate-180' : ''}`} />
          </MenuButton>
          <MenuItems className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border border-neutral-200 bg-white shadow-lg focus:outline-none">
            <MenuItem>
              <Button variant={'link'} to={ROUTES.account.profile.path} className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-t-lg">
                Mi perfil
              </Button>
            </MenuItem>
            <div className="border-t border-neutral-100" />
            <MenuItem>
              <Button variant="link"
                onClick={onLogout}
                className="block w-full px-4 py-2 text-left text-sm text-accent-secondary hover:text-accent-secondary-hover hover:bg-neutral-50 rounded-b-lg"
              >
                Logout
              </Button>
            </MenuItem>
          </MenuItems>
        </>
      )}
    </Menu>
  )
}
