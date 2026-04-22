import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import type { UserFavorites, FavoriteName } from '../../../favorites/types/favorite-type';

async function resolveFavoriteNames(nameIds: string[]): Promise<FavoriteName[]> {
  return Promise.all(
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
}

export function subscribeSharedFavorites(
  userId: string,
  onUpdate: (favorites: UserFavorites[]) => void
): () => void {
  const favRef = collection(db, 'userFavorites');
  const q = query(favRef, where('shared_with', 'array-contains', userId));

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const results = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const nameIds: string[] = Array.isArray(data.name_ids)
          ? data.name_ids.filter((id): id is string => typeof id === 'string')
          : [];
        const sharedWith: string[] = Array.isArray(data.shared_with)
          ? data.shared_with.filter((id): id is string => typeof id === 'string')
          : [];

        const names = await resolveFavoriteNames(nameIds);

        return {
          userId: typeof data.user_id === 'string' ? data.user_id : docSnap.id,
          names,
          sharedWith,
          updatedAt: data.updated_at?.toDate?.() ?? new Date(),
        } satisfies UserFavorites;
      })
    );

    onUpdate(results);
  });

  return unsubscribe;
}
