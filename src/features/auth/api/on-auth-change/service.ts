import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@src/lib/firebase';
import type { AuthUser, AuthUserDb } from '@src/features/auth/types/auth-type';
import { mapDbUserToDomain, readDisplayNameFromUserDb } from './mappers';

export function onAuthChange(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (!user) {
      callback(null);
      return;
    }

    let displayName = user.displayName;
    let avatarUrl: string | undefined;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const raw = (userDoc.data() ?? {}) as Partial<AuthUserDb> & Record<string, unknown>;

      if (!displayName) {
        displayName = readDisplayNameFromUserDb(raw) || user.email;
      }

      if (typeof raw.avatar_url === 'string') {
        avatarUrl = raw.avatar_url;
      }
    } catch {
      // Firestore unavailable — proceed with basic auth data
    }

    callback(mapDbUserToDomain(user, displayName, avatarUrl));
  });
}