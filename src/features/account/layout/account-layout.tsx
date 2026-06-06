import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "@src/features/auth/store/auth-store";
import { useFavoritesStoreSyncByUserId } from "@src/features/favorites/hooks/use-favorites";
import {
	selectedFavoritesCount,
	useFavoritesStore,
} from "@src/features/favorites/store/favorites-store";
import { cn } from "@src/lib/cn";
import { User, Heart, HeartHandshake } from "lucide-react";

const AccountLayout = () => {
	const userId = useAuthStore((state) => state.user?.uid);
	useFavoritesStoreSyncByUserId(userId);
	const favoritesCount = useFavoritesStore(selectedFavoritesCount);

	return (
		<div className="flex flex-col h-full md:flex-row">
			{/* Mobile: Tabs horizontales */}
			<nav className="flex md:hidden border-b border-neutral-200 px-4 overflow-x-auto scrollbar-hide bg-white">
				<NavLink
					to="profile"
					className={({ isActive }) =>
						cn(
							"shrink-0 px-4 py-3 text-sm font-medium text-neutral-600 border-b-2 border-transparent hover:text-neutral-900 transition-colors",
							isActive && "border-accent-primary text-accent-primary",
						)
					}
				>
					Perfil
				</NavLink>
				<NavLink
					to="favorites"
					className={({ isActive }) =>
						cn(
							"shrink-0 px-4 py-3 text-sm font-medium text-neutral-600 border-b-2 border-transparent hover:text-neutral-900 transition-colors",
							isActive && "border-accent-primary text-accent-primary",
						)
					}
				>
					Favoritos ({favoritesCount})
				</NavLink>
				<NavLink
					to="couple"
					className={({ isActive }) =>
						cn(
							"shrink-0 px-4 py-3 text-sm font-medium text-neutral-600 border-b-2 border-transparent hover:text-neutral-900 transition-colors",
							isActive && "border-accent-primary text-accent-primary",
						)
					}
				>
					Compartir
				</NavLink>
			</nav>

			{/* Desktop: Sidebar lateral */}
			<aside className="hidden md:flex md:flex-col md:w-[260px] md:border-r md:border-neutral-200 md:py-8 md:px-6 md:shrink-0">
				<h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
					Cuenta
				</h2>
				<nav className="space-y-2">
					<NavLink
						to="profile"
						className={({ isActive }) =>
							cn(
								"flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
								isActive 
									? "bg-accent-light text-accent-primary" 
									: "bg-white text-neutral-600 hover:bg-neutral-50",
							)
						}
					>
						{({ isActive }) => (
							<>
								<User 
									size={18} 
									className={isActive ? "text-accent-primary" : "text-neutral-500"}
								/>
								Perfil
							</>
						)}
					</NavLink>
					<NavLink
						to="favorites"
						className={({ isActive }) =>
							cn(
								"flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
								isActive 
									? "bg-accent-light text-accent-primary" 
									: "bg-white text-neutral-600 hover:bg-neutral-50",
							)
						}
					>
						{({ isActive }) => (
							<>
								<Heart 
									size={18}
									className={isActive ? "text-accent-primary" : "text-neutral-500"}
								/>
								Favoritos ({favoritesCount})
							</>
						)}
					</NavLink>
					<NavLink
						to="couple"
						className={({ isActive }) =>
							cn(
								"flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
								isActive 
									? "bg-accent-light text-accent-primary" 
									: "bg-white text-neutral-600 hover:bg-neutral-50",
							)
						}
					>
						{({ isActive }) => (
							<>
								<HeartHandshake 
									size={18}
									className={isActive ? "text-accent-primary" : "text-neutral-500"}
								/>
								Compartir
							</>
						)}
					</NavLink>
				</nav>
			</aside>

			{/* Contenido - SIN caja blanca contenedora */}
			<main className="flex-1 overflow-auto p-4 md:py-10 md:px-16">
				<Outlet />
			</main>
		</div>
	);
};

export default AccountLayout;
