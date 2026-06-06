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
    <header className="sticky top-0 z-40 border-b border-stroke-subtle bg-white h-[60px] md:h-[68px]">
        <div className="h-full max-w-7xl mx-auto px-4 flex justify-between items-center gap-4 md:gap-6">
          <Logo />
          <div className="hidden md:flex md:flex-1 md:justify-center">
            <Menu items={menuItems} />
          </div>
          {actions}
        </div>
    </header>
  )
}

export default Header