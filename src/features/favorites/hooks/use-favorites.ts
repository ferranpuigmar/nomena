import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFavorites, addFavorite as addFavoriteApi, removeFavorite as removeFavoriteApi } from '../api';
import { useFavoritesStore } from '../store/favorites-store';

const FAVORITES_QUERY_KEY = (userId: string) => ['favorites', userId];

export const useFavoritesStoreSyncByUserId = (userId?: string) => {
  const { setFavorites, clearFavorites } = useFavoritesStore();

  const { data: favoritesQueryData, isLoading } = useQuery({
    queryKey: FAVORITES_QUERY_KEY(userId || ''),
    queryFn: () => getFavorites(userId as string),
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) {
      clearFavorites();
      return;
    }

    setFavorites(favoritesQueryData ?? null);
  }, [userId, favoritesQueryData, setFavorites, clearFavorites]);

  return { isLoading };
};

export const useFavoritesByUserId = (userId?: string) => {
  const queryClient = useQueryClient();
  const { favorites, isFavorited } = useFavoritesStore();
  const { isLoading } = useFavoritesStoreSyncByUserId(userId);

  const addFavoriteMutation = useMutation({
    mutationFn: (nameId: string) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return addFavoriteApi(userId, nameId);
    },
    onSuccess: () => {
      if (!userId) {
        return;
      }
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY(userId) });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (nameId: string) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return removeFavoriteApi(userId, nameId);
    },
    onSuccess: () => {
      if (!userId) {
        return;
      }
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY(userId) });
    },
  });

  const toggleFavorite = async (nameId: string) => {
    if (!userId) {
      console.error('User not authenticated');
      return;
    }

    try {
      if (isFavorited(nameId)) {
        await removeFavoriteMutation.mutateAsync(nameId);
      } else {
        await addFavoriteMutation.mutateAsync(nameId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  return {
    toggleFavorite,
    isFavorited,
    favorites,
    isLoading,
  };
};
