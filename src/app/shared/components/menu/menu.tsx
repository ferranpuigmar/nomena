import { Button } from "../button/button";

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
		<nav className="flex items-center">
			{items.map((item) => (
				<Button
					key={item.to}
					to={item.to}
					end={item.exact}
					variant="link"
					size="md"
					activeVariant={!item.disableActiveStyle ? "link-accent" : undefined}
				>
					{item.label}
				</Button>
			))}
		</nav>
	);
};

export default Menu;
