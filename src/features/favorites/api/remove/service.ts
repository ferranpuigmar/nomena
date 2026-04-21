import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import type { UserFavoritesDb } from '../../types/favorite-type';
import { mapDbUserFavoritesToDomain, mapDomainToDb } from './mappers';

export async function removeFavorite(userId: string, nameId: string): Promise<void> {
  const docRef = doc(db, 'userFavorites', userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return;
  }

  const data = docSnap.data() as Partial<UserFavoritesDb> & Record<string, unknown>;
  const { currentNameIds, currentSharedWith } = mapDbUserFavoritesToDomain(data);

  await setDoc(
    docRef,
    mapDomainToDb({
      userId,
      currentNameIds: currentNameIds.filter((id) => id !== nameId),
      currentSharedWith,
    }),
    { merge: true }
  );
}