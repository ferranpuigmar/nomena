import { useEffect, createElement } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getFavorites, addFavorite as addFavoriteApi, removeFavorite as removeFavoriteApi } from '../api';
import { FavoriteToastContent } from '../components/favorite-toast-content';
import { useFavoritesStore } from '../store/favorites-store';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@src/features/auth/store/auth-store';
import { ROUTES } from '@src/app/router';

const FAVORITES_QUERY_KEY = (userId: string) => ['favorites', userId];

const FAVORITE_FALLBACK_NAME = 'este nombre';

const getFavoriteToastContent = (isRemoving: boolean, favoriteName: string) => {
  const action = isRemoving ? 'remove' : 'add';

  return {
    loading: createElement(FavoriteToastContent, {
      action,
      state: 'loading',
      favoriteName,
    }),
    success: createElement(FavoriteToastContent, {
      action,
      state: 'success',
      favoriteName,
    }),
  };
};

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
  const navigate = useNavigate();
  const location = useLocation();
  const setPendingAction = useAuthStore((state) => state.setPendingAction);



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

  const toggleFavorite = async (nameId: string, name?: string) => {
    if (!userId) {
      console.log('User not authenticated. Redirecting to login page.');
      
      navigate(ROUTES.login.path, {
        state: {
          from: location,
        }
      });
      setPendingAction({
        type: 'ADD_FAVORITE',
        payload: { nameId, name },
      });

      return;
    }

    const wasFavorited = isFavorited(nameId);
    const favoriteName = name?.trim() || FAVORITE_FALLBACK_NAME;
    const toastContent = getFavoriteToastContent(wasFavorited, favoriteName);
    const mutationPromise = wasFavorited
      ? removeFavoriteMutation.mutateAsync(nameId)
      : addFavoriteMutation.mutateAsync(nameId);

    try {
      await toast.promise(mutationPromise, {
        loading: toastContent.loading,
        success: toastContent.success,
        error: (error) => (error instanceof Error ? error.message : 'No se pudo actualizar favoritos'),
      });
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

