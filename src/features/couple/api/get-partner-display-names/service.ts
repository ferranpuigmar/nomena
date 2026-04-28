import { doc, getDoc } from 'firebase/firestore';
import { db } from '@src/lib/firebase';
import type { AuthUserDb } from '@src/features/auth/types/auth-type';

export async function getPartnerDisplayNames(
  userIds: string[]
): Promise<Record<string, string | null>> {
  const entries = await Promise.all(
    userIds.map(async (uid) => {
      const snap = await getDoc(doc(db, 'users', uid));
      const data = snap.exists() ? (snap.data() as Partial<AuthUserDb>) : null;
      const displayName = typeof data?.display_name === 'string' ? data.display_name : null;
      return [uid, displayName] as const;
    })
  );

  return Object.fromEntries(entries);
}
