import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeName } from '../utils/name-utils';
import { fetchBehindTheName, sleep, RATE_LIMIT_MS, type BehindTheNameResult } from '../api/providers/behind-the-name';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.BEHINDTHENAME_API_KEY as string;
if (!API_KEY) throw new Error('Falta BEHINDTHENAME_API_KEY en las variables de entorno');

const OUTPUT_FILE = path.resolve(__dirname, '../files/behindthename.json');

async function main() {
  const ineFile = path.resolve(__dirname, '../files/ine-unique-names.json');
  if (!fs.existsSync(ineFile)) {
    throw new Error(`No se encuentra ${ineFile}. Ejecuta primero seed:extract:names`);
  }

  const names: string[] = JSON.parse(fs.readFileSync(ineFile, 'utf-8'));

  // Cargar progreso previo si existe (resume)
  const result: Record<string, BehindTheNameResult> = fs.existsSync(OUTPUT_FILE)
    ? JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'))
    : {};

  const pending = names.filter(name => !(normalizeName(name) in result));
  console.log(`Total: ${names.length} | Ya procesados: ${names.length - pending.length} | Pendientes: ${pending.length}`);

  for (let i = 0; i < pending.length; i++) {
    const name = pending[i];
    const normalizedName = normalizeName(name);
    const enriched = await fetchBehindTheName(name, API_KEY);
    if (enriched) result[normalizedName] = enriched;

    // Guardar progreso cada 50 nombres
    if (i % 50 === 0) {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf-8');
      console.log(`Procesados ${i}/${pending.length} pendientes (${Object.keys(result).length} total enriquecidos)...`);
    }

    await sleep(RATE_LIMIT_MS);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`✓ JSON guardado en ${OUTPUT_FILE} (${Object.keys(result).length} nombres enriquecidos)`);
}

main();
