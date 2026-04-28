import type { MenuItem } from '@src/app/shared/components/menu/menu'

export const getFavoritesNavItems = (favoritesCount: number): MenuItem[] => [
  {
    to: '/account/favorites',
    label: `Favoritos (${favoritesCount})`,
    disableActiveStyle: true,
  },
]

