import {
  collection,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import type { Name } from '../types';

export async function getNames(): Promise<Name[]> {
  const q = query(collection(db, 'names'), orderBy('name'));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Name, 'id'>),
  }));
}