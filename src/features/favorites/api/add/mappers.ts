import { Timestamp } from 'firebase/firestore';
import type { UserFavoritesDb } from '../../types/favorite-type';

export type AddFavoriteDomainModel = {
  userId: string;
  currentNameIds: string[];
  currentSharedWith: string[];
};

export function mapDbUserFavoritesToDomain(
  raw: Partial<UserFavoritesDb> & Record<string, unknown>
): Pick<AddFavoriteDomainModel, 'currentNameIds' | 'currentSharedWith'> {
  const currentNameIds = Array.isArray(raw.name_ids)
    ? raw.name_ids.filter((item): item is string => typeof item === 'string')
    : [];

  const currentSharedWith = Array.isArray(raw.shared_with)
    ? raw.shared_with.filter((item): item is string => typeof item === 'string')
    : [];

  return { currentNameIds, currentSharedWith };
}

export function mapDomainToDb(
  domain: AddFavoriteDomainModel
): UserFavoritesDb {
  return {
    user_id: domain.userId,
    name_ids: domain.currentNameIds,
    shared_with: domain.currentSharedWith,
    updated_at: Timestamp.now(),
  };
}