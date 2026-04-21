import { create } from 'zustand';
import type { UserFavorites } from '../types/favorite-type';

export interface FavoritesState {
  favorites: UserFavorites | null;
  setFavorites: (favorites: UserFavorites | null) => void;
  clearFavorites: () => void;
  isFavorited: (nameId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: null,
  setFavorites: (favorites) => set({ favorites }),
  clearFavorites: () => set({ favorites: null }),

  isFavorited: (nameId: string) => {
    const { favorites } = get();
    return favorites?.names.some((item) => item.id === nameId) ?? false;
  },
}));

// Selectores para UI
export const selectedFavorites = (state: FavoritesState) => state.favorites;
export const selectedFavoritesCount = (state: FavoritesState) =>
  state.favorites?.names.length ?? 0;
