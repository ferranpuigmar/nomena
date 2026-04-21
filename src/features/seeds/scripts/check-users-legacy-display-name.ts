import { adminDb } from '../api/firebase/admin';

async function checkUsersLegacyDisplayName(): Promise<void> {
  const snapshot = await adminDb.collection('users').where('displayName', '!=', null).get();

  console.log(`Documentos con campo legacy displayName: ${snapshot.size}`);

  if (!snapshot.empty) {
    const ids = snapshot.docs.map((doc) => doc.id);
    console.log('IDs con displayName legacy:');
    ids.forEach((id) => console.log(`- ${id}`));
  }
}

checkUsersLegacyDisplayName().catch((error) => {
  console.error('Error verificando displayName legacy:', error);
  process.exitCode = 1;
});
