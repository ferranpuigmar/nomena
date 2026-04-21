export type FavoriteName = {
  id: string;
  name: string;
};

export type UserFavoritesDb = {
  user_id: string;
  name_ids: string[];
  shared_with: string[];
  updated_at: Date;
};

export type UserFavorites = {
  userId: string;
  names: FavoriteName[];
  sharedWith: string[];
  updatedAt: Date;
};
