import {
  DocumentSnapshot,
  QueryConstraint,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { db } from '@src/lib/firebase';
import type { Filters, Name, NameDb } from '@src/features/names/types/names-type';
import { mapDbNameToDomain, normalizeDbName } from './mappers';

type GetNamesParams = {
  pageSize?: number;
  cursor?: DocumentSnapshot;
  filters?: Filters;
};

export type GetNamesPage = {
  items: Name[];
  nextCursor: DocumentSnapshot | null;
  hasMore: boolean;
};

export async function getNames({
  pageSize = 50,
  cursor,
  filters
}: GetNamesParams = {}): Promise<GetNamesPage> {

  const contraints: QueryConstraint[] = []
  
  if (filters) {
    if (filters.gender && filters.gender.length > 0) {
      contraints.push(where('gender', 'in', filters.gender))
    }
    if (filters.usageScore) {
      contraints.push(where('usage_score', '>=', filters.usageScore.min))
      contraints.push(where('usage_score', '<=', filters.usageScore.max))
    }
    if (filters.length_category && filters.length_category.length > 0) {
      contraints.push(where('length_category', 'in', filters.length_category))
    }
  }

  console.log('Fetching names with constraints:', contraints, 'and cursor:', cursor?.id);



  const q = cursor
    ? query(
        collection(db, 'names'),
        ...contraints,
        orderBy('name'),
        startAfter(cursor),
        limit(pageSize),
      )
    : query(
        collection(db, 'names'),
        ...contraints,
        orderBy('name'),
        limit(pageSize),
      );

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