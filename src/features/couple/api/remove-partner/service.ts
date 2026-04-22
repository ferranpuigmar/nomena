import { doc, getDoc, writeBatch, arrayRemove } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';

export async function removePartner(userId: string, partnerUserId: string): Promise<void> {
  const userFavRef = doc(db, 'userFavorites', userId);
  const partnerFavRef = doc(db, 'userFavorites', partnerUserId);

  const [userSnap, partnerSnap] = await Promise.all([
    getDoc(userFavRef),
    getDoc(partnerFavRef),
  ]);

  const batch = writeBatch(db);

  if (userSnap.exists()) {
    batch.update(userFavRef, { shared_with: arrayRemove(partnerUserId) });
  }

  if (partnerSnap.exists()) {
    batch.update(partnerFavRef, { shared_with: arrayRemove(userId) });
  }

  await batch.commit();
}
