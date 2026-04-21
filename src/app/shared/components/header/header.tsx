import type { ReactNode } from 'react'
import Menu from '../menu/menu'
import type { MenuItem } from '../menu/menu'
import Logo from '../logo/logo'

type HeaderProps = {
  menuItems: MenuItem[]
  actions?: ReactNode
}

const Header = ({ menuItems, actions }: HeaderProps) => {

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-6">
          <Logo />
          <Menu items={menuItems} />
          {actions}
        </div>
    </header>
  )
}

export default Header