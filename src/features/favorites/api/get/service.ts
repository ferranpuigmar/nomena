import { doc, getDoc } from 'firebase/firestore';
import { db } from '@src/lib/firebase';
import type { FavoriteName, UserFavorites, UserFavoritesDb } from '@src/features/favorites/types/favorite-type';
import { mapDbUserFavoritesToDomain, mapRawDbToDbModel } from './mappers';

async function resolveFavoriteNames(nameIds: string[]): Promise<FavoriteName[]> {
  const favorites = await Promise.all(
    nameIds.map(async (nameId) => {
      const nameDoc = await getDoc(doc(db, 'names', nameId));
      const data = nameDoc.exists() ? nameDoc.data() : null;

      return {
        id: nameId,
        name: typeof data?.name === 'string' ? data.name : nameId,
        usageScore: typeof data?.usage_score === 'number' ? data.usage_score : undefined,
        gender: data?.gender ?? undefined,
        origin: typeof data?.origin === 'string' ? data.origin : undefined,
      };
    })
  );

  return favorites;
}

export async function getFavorites(userId: string): Promise<UserFavorites | null> {
  const docRef = doc(db, 'userFavorites', userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const rawData = docSnap.data() as Partial<UserFavoritesDb> & Record<string, unknown>;
  const dbModel = mapRawDbToDbModel(rawData);
  const resolvedFavorites = await resolveFavoriteNames(dbModel.name_ids);

  return mapDbUserFavoritesToDomain(dbModel, resolvedFavorites);
}