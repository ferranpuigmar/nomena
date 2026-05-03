// Genera names.json combinando el Excel del INE con el enrichmentMap de Behind the Name
// Ejecuta: npm run seed:generate:json

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import xlsx from 'xlsx';
import type { NameSeed } from '../types/seed-type';
import { normalizeName } from '@src/app/shared/utils/normalizeName';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const EXCEL_FILE = path.resolve(__dirname, '../files/nombres_por_edad_media.xlsx');
const BEHINDTHENAME_FILE = path.resolve(__dirname, '../files/nameDictionary-enriched-full-web.json');
const OUTPUT_FILE = path.resolve(__dirname, '../files/names.json');

const enrichmentMap: Record<string, { meaning?: string; origin?: string; genderEstimate?: 'boy' | 'girl' | 'neutral' }> =
  fs.existsSync(BEHINDTHENAME_FILE)
    ? JSON.parse(fs.readFileSync(BEHINDTHENAME_FILE, 'utf-8'))
    : {};

function parseSheet(sheet: xlsx.WorkSheet, gender: 'boy' | 'girl'): NameSeed[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = xlsx.utils.sheet_to_json<any>(sheet, { header: 1 }) as any[][];

  return rows
    .slice(7)
    .filter(row => row[1])
    .filter(row => !/[\s-]/.test(String(row[1])))
    .map(row => {
      const name: string = String(row[1]);
      const normalizedName = normalizeName(name);
      const enriched = enrichmentMap[normalizedName] ?? {};
      const { genderEstimate, ...enrichedRest } = enriched;
      return {
        id: randomUUID(),
        name,
        normalized_name: normalizedName,
        gender: genderEstimate ?? gender,
        length: name.length,
        length_category: name.length <= 4 ? 'short' : 'long',
        popularity_rank: Number(row[0]),
        usage_score: Number(row[2]),
        ...enrichedRest,
      };
    });
}

function main() {
  const workbook = xlsx.readFile(EXCEL_FILE);
  const seeds: NameSeed[] = [];

  for (const sheetName of workbook.SheetNames) {
    const gender: 'boy' | 'girl' = sheetName.toLowerCase().includes('mujer') ? 'girl' : 'boy';
    const parsed = parseSheet(workbook.Sheets[sheetName], gender);
    console.log(`Hoja "${sheetName}" (${gender}): ${parsed.length} nombres`);
    seeds.push(...parsed);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(seeds, null, 2), 'utf-8');
  console.log(`✓ names.json generado con ${seeds.length} nombres en ${OUTPUT_FILE}`);
}

main();
