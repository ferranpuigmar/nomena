import { NavLink } from "react-router-dom";
import { cn } from "@src/lib/cn";

export type MenuItem = {
	to: string;
	label: string;
	exact?: boolean;
	disableActiveStyle?: boolean;
};

type MenuProps = {
	items: MenuItem[];
};

const Menu = ({ items }: MenuProps) => {
	return (
		<nav className="flex items-center gap-6">
			{items.map((item) => (
				<NavLink
					key={item.to}
					to={item.to}
					end={item.exact}
					className={({ isActive }) =>
						cn(
							"text-sm font-medium text-gray-600 hover:text-gray-900",
							isActive &&
								!item.disableActiveStyle &&
								"font-bold text-gray-900 border-b-2 border-gray-900",
						)
					}
				>
					{item.label}
				</NavLink>
			))}
		</nav>
	);
};

export default Menu;
