import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  writeBatch,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import type { InviteCodeDb } from '../../types/couple-type';
import { INVITE_CODE_TTL_MS } from '../../types/couple-type';

export async function redeemInvite(redeemerUserId: string, code: string): Promise<void> {
  // 1. Find invite code document
  const codesRef = collection(db, 'inviteCodes');
  const q = query(codesRef, where('code', '==', code));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error('Código de invitación no válido.');
  }

  const inviteDoc = snapshot.docs[0];
  const inviteData = inviteDoc.data() as InviteCodeDb;

  // 2. Verify TTL
  const createdAt = inviteData.created_at.toDate();
  const isExpired = Date.now() - createdAt.getTime() > INVITE_CODE_TTL_MS;
  if (isExpired) {
    throw new Error('El código de invitación ha expirado.');
  }

  const ownerUserId = inviteData.user_id;

  if (ownerUserId === redeemerUserId) {
    throw new Error('No puedes usar tu propio código de invitación.');
  }

  // 3. Ensure both userFavorites documents exist
  const ownerFavRef = doc(db, 'userFavorites', ownerUserId);
  const redeemerFavRef = doc(db, 'userFavorites', redeemerUserId);

  const [ownerSnap, redeemerSnap] = await Promise.all([
    getDoc(ownerFavRef),
    getDoc(redeemerFavRef),
  ]);

  // 4. Atomic batch write
  const batch = writeBatch(db);

  if (!ownerSnap.exists()) {
    batch.set(ownerFavRef, {
      user_id: ownerUserId,
      name_ids: [],
      shared_with: [redeemerUserId],
      updated_at: Timestamp.now(),
    });
  } else {
    batch.update(ownerFavRef, { shared_with: arrayUnion(redeemerUserId) });
  }

  if (!redeemerSnap.exists()) {
    batch.set(redeemerFavRef, {
      user_id: redeemerUserId,
      name_ids: [],
      shared_with: [ownerUserId],
      updated_at: Timestamp.now(),
    });
  } else {
    batch.update(redeemerFavRef, { shared_with: arrayUnion(ownerUserId) });
  }

  batch.delete(inviteDoc.ref);

  await batch.commit();
}
