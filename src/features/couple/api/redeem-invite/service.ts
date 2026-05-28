import {
  doc,
  getDoc,
  writeBatch,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@src/lib/firebase';
import type { InviteCodeDb } from '@src/features/couple/types/couple-type';
import { INVITE_CODE_TTL_MS } from '@src/features/couple/types/couple-type';

export async function redeemInvite(redeemerUserId: string, code: string): Promise<void> {
  const inviteRef = doc(db, 'inviteCodes', code);
  const inviteSnap = await getDoc(inviteRef);

  if (!inviteSnap.exists()) {
    throw new Error('Código de invitación no válido.');
  }

  const inviteData = inviteSnap.data() as InviteCodeDb;

  const createdAt = inviteData.created_at.toDate();
  const isExpired = Date.now() - createdAt.getTime() > INVITE_CODE_TTL_MS;
  if (isExpired) {
    throw new Error('El código de invitación ha expirado.');
  }

  const ownerUserId = inviteData.user_id;

  if (ownerUserId === redeemerUserId) {
    throw new Error('No puedes usar tu propio código de invitación.');
  }

  const ownerFavRef = doc(db, 'userFavorites', ownerUserId);
  const redeemerFavRef = doc(db, 'userFavorites', redeemerUserId);
  const activeInviteRef = doc(db, 'userActiveInvite', ownerUserId);

  const [ownerSnap, redeemerSnap] = await Promise.all([
    getDoc(ownerFavRef),
    getDoc(redeemerFavRef),
  ]);

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

  batch.delete(inviteRef);
  batch.delete(activeInviteRef);

  await batch.commit();
}
