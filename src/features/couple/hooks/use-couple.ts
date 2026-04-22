import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { generateInvite, redeemInvite, getSharedFavorites, removePartner, subscribeSharedFavorites, getPartnerDisplayNames } from '../api';
import { useCoupleStore } from '../store/couple-store';

const SHARED_FAVORITES_QUERY_KEY = (userId: string) => ['sharedFavorites', userId];
const PARTNER_NAMES_QUERY_KEY = (partnerIds: string[]) => ['partnerDisplayNames', ...partnerIds];

export const useCouple = (userId?: string) => {
  const queryClient = useQueryClient();
  const { generatedCode, setGeneratedCode } = useCoupleStore();

  // Initial load via React Query
  const { data: sharedFavorites = [], isLoading: isLoadingShared } = useQuery({
    queryKey: SHARED_FAVORITES_QUERY_KEY(userId || ''),
    queryFn: () => getSharedFavorites(userId as string),
    enabled: !!userId,
  });

  // Real-time updates: onSnapshot pushes changes into the RQ cache
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeSharedFavorites(userId, (favorites) => {
      queryClient.setQueryData(SHARED_FAVORITES_QUERY_KEY(userId), favorites);
    });

    return unsubscribe;
  }, [userId, queryClient]);

  const partnerIds = sharedFavorites.map((f) => f.userId);

  const { data: partnerDisplayNames = {} } = useQuery({
    queryKey: PARTNER_NAMES_QUERY_KEY(partnerIds),
    queryFn: () => getPartnerDisplayNames(partnerIds),
    enabled: partnerIds.length > 0,
  });

  const generateInviteMutation = useMutation({
    mutationFn: () => {
      if (!userId) throw new Error('Usuario no autenticado');
      return generateInvite(userId);
    },
    onSuccess: (code) => {
      setGeneratedCode(code);
    },
  });

  const redeemInviteMutation = useMutation({
    mutationFn: (code: string) => {
      if (!userId) throw new Error('Usuario no autenticado');
      return redeemInvite(userId, code);
    },
  });

  const removePartnerMutation = useMutation({
    mutationFn: (partnerUserId: string) => {
      if (!userId) throw new Error('Usuario no autenticado');
      return removePartner(userId, partnerUserId);
    },
  });

  return {
    sharedFavorites,
    partnerDisplayNames,
    generatedCode,
    isLoadingShared,
    generateInvite: generateInviteMutation.mutate,
    isGenerating: generateInviteMutation.isPending,
    redeemInvite: redeemInviteMutation.mutate,
    isRedeeming: redeemInviteMutation.isPending,
    redeemError: redeemInviteMutation.error,
    removePartner: removePartnerMutation.mutate,
    isRemoving: removePartnerMutation.isPending,
  };
};
