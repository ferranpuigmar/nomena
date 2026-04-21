import type { MenuItem } from '../../../app/shared/components/menu/menu'

export const getFavoritesNavItems = (favoritesCount: number): MenuItem[] => [
  {
    to: '/account/favorites',
    label: `Favoritos (${favoritesCount})`,
    disableActiveStyle: true,
  },
]

