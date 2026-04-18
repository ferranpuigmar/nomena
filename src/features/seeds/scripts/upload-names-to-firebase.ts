// Sube names.json a Firestore
// Ejecuta: npm run seed:upload

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadNamesToFirestore } from '../api/firebase/upload';
import type { NameSeed } from '../types/seed-type';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NAMES_FILE = path.resolve(__dirname, '../files/names.json');

async function main() {
  if (!fs.existsSync(NAMES_FILE)) {
    throw new Error(`No se encuentra ${NAMES_FILE}. Ejecuta primero seed:generate:json`);
  }

  const seeds: NameSeed[] = JSON.parse(fs.readFileSync(NAMES_FILE, 'utf-8'));
  console.log(`Subiendo ${seeds.length} nombres a Firestore...`);

  await uploadNamesToFirestore(seeds);

  console.log(`✓ ${seeds.length} documentos subidos a la colección 'names'`);
}

main();
