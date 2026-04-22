import { Timestamp } from 'firebase/firestore';
import type {
  FavoriteName,
  UserFavoritesDb,
  UserFavorites,
} from '../../types/favorite-type';

export type GetFavoritesDbModel = {
  user_id: string;
  name_ids: string[];
  shared_with: string[];
  updated_at: Timestamp;
};

export type GetFavoritesDomainModel = UserFavorites;

export function mapRawDbToDbModel(
  raw: Partial<UserFavoritesDb> & Record<string, unknown>
): GetFavoritesDbModel {
  const user_id = typeof raw.user_id === 'string' ? raw.user_id : '';

  const name_ids = Array.isArray(raw.name_ids)
    ? raw.name_ids.filter((item): item is string => typeof item === 'string')
    : [];

  const shared_with = Array.isArray(raw.shared_with)
    ? raw.shared_with.filter((item): item is string => typeof item === 'string')
    : [];

  const updated_at = raw.updated_at instanceof Timestamp ? raw.updated_at : Timestamp.now();

  return {
    user_id,
    name_ids,
    shared_with,
    updated_at,
  };
}

export function mapDbUserFavoritesToDomain(
  dbModel: GetFavoritesDbModel,
  resolvedNames: FavoriteName[]
): GetFavoritesDomainModel {
  return {
    userId: dbModel.user_id,
    names: resolvedNames,
    sharedWith: dbModel.shared_with,
    updatedAt: dbModel.updated_at.toDate(),
  };
}