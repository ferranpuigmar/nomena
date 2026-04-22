// Elimina nombres compuestos (con espacio o guión) de names.json
// Ejecuta: npx tsx src/features/seeds/scripts/clean-compound-names.ts

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { NameSeed } from '../types/seed-type';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NAMES_FILE = path.resolve(__dirname, '../files/names.json');

const seeds: NameSeed[] = JSON.parse(fs.readFileSync(NAMES_FILE, 'utf-8'));
const before = seeds.length;

const cleaned = seeds.filter((s) => !/[\s-]/.test(s.name));
const removed = before - cleaned.length;

fs.writeFileSync(NAMES_FILE, JSON.stringify(cleaned, null, 2), 'utf-8');
console.log(`✓ Eliminados ${removed} nombres compuestos. Quedan ${cleaned.length} nombres simples.`);
