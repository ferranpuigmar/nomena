
import { adminDb } from '@src/lib/firebase-admin';
import type { NameSeed } from '@src/features/seeds/types/seed-type';

const BATCH_SIZE = 500;

export async function uploadNamesToFirestore(seeds: NameSeed[]): Promise<void> {
  for (let i = 0; i < seeds.length; i += BATCH_SIZE) {
    const batch = adminDb.batch();
    seeds.slice(i, i + BATCH_SIZE).forEach(seed => {
      batch.set(adminDb.collection('names').doc(seed.id), seed);
    });
    await batch.commit();
    console.log(`Batch ${i / BATCH_SIZE + 1}/${Math.ceil(seeds.length / BATCH_SIZE)} subido`);
  }
}
