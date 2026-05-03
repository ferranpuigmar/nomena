// Actualiza en Firestore los campos `origin` (array) y `meaning` de los nombres
// que los tienen en names.json pero no en la base de datos (o los sobreescribe).
// Ejecuta: npm run seed:migrate:origin-meaning

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { adminDb } from '@src/lib/firebase-admin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NAMES_FILE = path.resolve(__dirname, '../files/names.json');

interface NameEntry {
  id: string;
  meaning?: string;
  origin?: string[];
  [key: string]: unknown;
}

const BATCH_SIZE = 500;

async function main() {
  if (!fs.existsSync(NAMES_FILE)) {
    throw new Error(`No se encuentra ${NAMES_FILE}`);
  }

  const names: NameEntry[] = JSON.parse(fs.readFileSync(NAMES_FILE, 'utf-8'));

  // Only update names that have at least one of the two fields populated
  const toUpdate = names.filter(
    n => (n.meaning && n.meaning.trim() !== '') || (n.origin && n.origin.length > 0)
  );

  console.log(`Total en JSON: ${names.length} | A actualizar en Firestore: ${toUpdate.length}\n`);

  let updated = 0;

  for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
    const chunk = toUpdate.slice(i, i + BATCH_SIZE);
    const batch = adminDb.batch();

    chunk.forEach(name => {
      const ref = adminDb.collection('names').doc(name.id);
      const patch: Record<string, unknown> = {};
      if (name.meaning && name.meaning.trim() !== '') patch.meaning = name.meaning;
      if (name.origin && name.origin.length > 0) patch.origin = name.origin;
      batch.update(ref, patch);
    });

    await batch.commit();
    updated += chunk.length;

    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toUpdate.length / BATCH_SIZE);
    console.log(`Batch ${batchNum}/${totalBatches} — ${updated}/${toUpdate.length} actualizados`);
  }

  console.log(`\n✓ Completado. ${updated} documentos actualizados en Firestore.`);
}

main().catch(console.error);
