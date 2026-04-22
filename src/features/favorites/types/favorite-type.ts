import { Timestamp } from 'firebase/firestore';
import type { NameGender } from '../../names/types/names-type';

export type FavoriteName = {
  id: string;
  name: string;
  usageScore?: number;
  gender?: NameGender;
  origin?: string;
};

export type UserFavoritesDb = {
  user_id: string;
  name_ids: string[];
  shared_with: string[];
  updated_at: Timestamp;
};

export type UserFavorites = {
  userId: string;
  names: FavoriteName[];
  sharedWith: string[];
  updatedAt: Date;
};
