import type { MenuItem } from '@src/app/shared/components/menu/menu'

export const getFavoritesNavItems = (): MenuItem[] => [
  {
    to: '/account/favorites',
    label: `Favoritos`,
    disableActiveStyle: true,
  },
]

