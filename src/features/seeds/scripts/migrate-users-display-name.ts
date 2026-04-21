import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '../api/firebase/admin';

const USERS_COLLECTION = 'users';
const BATCH_LIMIT = 400;

type UserLegacyData = {
  display_name?: unknown;
  displayName?: unknown;
};

async function migrateUsersDisplayName(): Promise<void> {
  const snapshot = await adminDb.collection(USERS_COLLECTION).get();

  if (snapshot.empty) {
    console.log(`No hay documentos en '${USERS_COLLECTION}'.`);
    return;
  }

  let batch = adminDb.batch();
  let batchOps = 0;
  let updatedCount = 0;
  let deletedLegacyOnlyCount = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data() as UserLegacyData & Record<string, unknown>;
    const hasLegacyField = Object.prototype.hasOwnProperty.call(data, 'displayName');

    if (!hasLegacyField) {
      continue;
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date(),
      displayName: FieldValue.delete(),
    };

    if (typeof data.display_name !== 'string' && typeof data.displayName === 'string') {
      updatePayload.display_name = data.displayName;
      updatedCount += 1;
    } else {
      deletedLegacyOnlyCount += 1;
    }

    batch.update(docSnap.ref, updatePayload);
    batchOps += 1;

    if (batchOps >= BATCH_LIMIT) {
      await batch.commit();
      batch = adminDb.batch();
      batchOps = 0;
    }
  }

  if (batchOps > 0) {
    await batch.commit();
  }

  console.log(`Migracion completada en '${USERS_COLLECTION}'.`);
  console.log(`- display_name rellenado desde displayName: ${updatedCount}`);
  console.log(`- displayName legacy eliminado (ya existia display_name): ${deletedLegacyOnlyCount}`);
}

migrateUsersDisplayName().catch((error) => {
  console.error('Error durante la migracion de users.displayName:', error);
  process.exitCode = 1;
});