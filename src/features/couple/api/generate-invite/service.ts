import { nanoid } from 'nanoid';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@src/lib/firebase';
import type { InviteCodeDb } from '@src/features/couple/types/couple-type';

export async function generateInvite(userId: string): Promise<string> {
  const code = nanoid(21);
  const inviteRef = doc(db, 'inviteCodes', code);
  const activeRef = doc(db, 'userActiveInvite', userId);

  const inviteDb: InviteCodeDb = {
    code,
    user_id: userId,
    created_at: Timestamp.now(),
  };

  await Promise.all([
    setDoc(inviteRef, inviteDb),
    setDoc(activeRef, { code, created_at: Timestamp.now() }),
  ]);

  return code;
}
