import '../../../lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

type Counter = Record<string, number>;


export const generateInitialLetters = async () => {
    const letters = new Set<string>();
    const counter: Counter = {};
    try {
        const db = getFirestore();
        const q = db.collection('names');
        const snapshot = await q.get();

        snapshot.docs.forEach(doc => {
            const name = doc.data().name as string;
            if (name) {
                const letter = name[0].toUpperCase();
                letters.add(letter);
                counter[letter] = (counter[letter] || 0) + 1;
            }
        });
    } catch (error) {
        console.error('Error generating initial letters:', error);
    }

    const lettersArray = Array.from(letters).sort();
    const sortedCounts = Object.fromEntries(
        Object.entries(counter).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );
    const table = {
        letters: lettersArray,
        counts: sortedCounts
    };

    try {
        const db = getFirestore();
        const docRef = db.collection('initial_letters').doc('table');
        await docRef.set(table);
        console.log('Initial letters table saved successfully');
    } catch (error) {
        console.error('Error saving initial letters table:', error);
    }
}

generateInitialLetters();