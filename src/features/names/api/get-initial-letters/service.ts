import { db } from "@src/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export type GetInitialLetters = {
  letters: string[];
  counts: Record<string, number>;
};

export const getInitialLetters = async (): Promise<GetInitialLetters> => {
  const snapshot = await getDocs(collection(db, 'initial_letters'));
  const letters = snapshot.docs.map(doc => ({
    letters: doc.data().letters as string[],
    counts: doc.data().counts as Record<string, number>
  }));

  return letters[0];
} 