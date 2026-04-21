import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import type { FavoriteName, UserFavorites, UserFavoritesDb } from '../../types/favorite-type';
import { mapDbUserFavoritesToDomain, mapRawDbToDbModel } from './mappers';

async function resolveFavoriteNames(nameIds: string[]): Promise<FavoriteName[]> {
  const favorites = await Promise.all(
    nameIds.map(async (nameId) => {
      const nameDoc = await getDoc(doc(db, 'names', nameId));
      const resolvedName = nameDoc.exists() ? nameDoc.data()?.name : null;

      return {
        id: nameId,
        name: typeof resolvedName === 'string' ? resolvedName : nameId,
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