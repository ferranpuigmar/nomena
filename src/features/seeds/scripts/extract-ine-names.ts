// Extrae todos los nombres únicos del Excel del INE y los guarda en un JSON
// Ejecuta: npm run seed:extract:names

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const EXCEL_FILE = path.resolve(__dirname, '../files/nombres_por_edad_media.xlsx');
const OUTPUT_FILE = path.resolve(__dirname, '../files/ine-unique-names.json');

function main() {
  const workbook = xlsx.readFile(EXCEL_FILE);
  const uniqueNames = new Set<string>();

  for (const sheetName of workbook.SheetNames) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = xlsx.utils.sheet_to_json<any>(workbook.Sheets[sheetName], { header: 1 }) as any[][];
    rows.slice(7).forEach(row => {
      if (row[1]) uniqueNames.add(String(row[1]));
    });
  }

  const names = Array.from(uniqueNames).sort();
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(names, null, 2), 'utf-8');
  console.log(`✓ ${names.length} nombres únicos guardados en ${OUTPUT_FILE}`);
}

main();
