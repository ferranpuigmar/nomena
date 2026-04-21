import {
  DocumentSnapshot,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import type { Name, NameDb } from '../../types/api-type';
import { mapDbNameToDomain, normalizeDbName } from './mappers';

type GetNamesParams = {
  pageSize?: number;
  cursor?: DocumentSnapshot;
};

export type GetNamesPage = {
  items: Name[];
  nextCursor: DocumentSnapshot | null;
  hasMore: boolean;
};

export async function getNames({
  pageSize = 50,
  cursor,
}: GetNamesParams = {}): Promise<GetNamesPage> {
  const q = cursor
    ? query(
        collection(db, 'names'),
        orderBy('name'),
        startAfter(cursor),
        limit(pageSize),
      )
    : query(collection(db, 'names'), orderBy('name'), limit(pageSize));

  const snapshot = await getDocs(q);

  const items = snapshot.docs.map((docItem) => {
    const raw = docItem.data() as Partial<NameDb> & Record<string, unknown>;
    const dbModel = normalizeDbName(raw);
    return mapDbNameToDomain(docItem.id, dbModel);
  });

  const lastDoc = snapshot.docs.at(-1) ?? null;

  return {
    items,
    nextCursor: lastDoc,
    hasMore: snapshot.docs.length === pageSize,
  };
}