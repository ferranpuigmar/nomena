import { adminDb } from "../../../../lib/firebase-admin";

export async function clearCollection(collectionName: string): Promise<void> {
  const BATCH_SIZE = 500;
  let deleted = 0;

  while (true) {
    const snapshot = await adminDb.collection(collectionName).limit(BATCH_SIZE).get();
    if (snapshot.empty) break;

    const batch = adminDb.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    deleted += snapshot.size;
    console.log(`Eliminados ${deleted} documentos...`);
  }

  console.log(`✓ Colección '${collectionName}' vaciada (${deleted} documentos eliminados)`);
}
