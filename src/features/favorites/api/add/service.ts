import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import type { UserFavoritesDb } from '../../types/favorite-type';
import { mapDbUserFavoritesToDomain, mapDomainToDb } from './mappers';

export async function addFavorite(userId: string, nameId: string): Promise<void> {
  const docRef = doc(db, 'userFavorites', userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    await setDoc(
      docRef,
      mapDomainToDb({
        userId,
        currentNameIds: [nameId],
        currentSharedWith: [],
      })
    );

    return;
  }

  const data = docSnap.data() as Partial<UserFavoritesDb> & Record<string, unknown>;
  const { currentNameIds, currentSharedWith } = mapDbUserFavoritesToDomain(data);

  if (!currentNameIds.includes(nameId)) {
    await setDoc(
      docRef,
      mapDomainToDb({
        userId,
        currentNameIds: [...currentNameIds, nameId],
        currentSharedWith,
      }),
      { merge: true }
    );
  }
}