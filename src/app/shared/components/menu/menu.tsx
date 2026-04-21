import { NavLink } from 'react-router-dom'

export type MenuItem = {
    to: string
    label: string
    exact?: boolean
    disableActiveStyle?: boolean
}

type MenuProps = {
    items: MenuItem[]
}

const Menu = ({ items }: MenuProps) => {
    return (
        <nav className="flex items-center gap-6">
            {items.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    className={({ isActive }) =>
                        isActive && !item.disableActiveStyle
                            ? 'text-sm font-bold text-gray-900 border-b-2 border-gray-900'
                            : 'text-sm font-medium text-gray-600 hover:text-gray-900'
                    }
                >
                    {item.label}
                </NavLink>
            ))}
        </nav>
    )
}

export default Menu