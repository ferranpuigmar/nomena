import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchBehindTheName, sleep, RATE_LIMIT_MS } from '../api/providers/behind-the-name';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.BEHINDTHENAME_API_KEY as string;
if (!API_KEY) throw new Error('Falta BEHINDTHENAME_API_KEY en las variables de entorno');

const DICT_FILE = path.resolve(__dirname, '../files/nameDictionary-enriched-full-web.json');

interface NameEntry {
  meaning?: string;
  origin?: string;
  genderEstimate?: string;
  confidence?: string;
}

async function main() {
  if (!fs.existsSync(DICT_FILE)) {
    throw new Error(`No se encuentra ${DICT_FILE}`);
  }

  const dict: Record<string, NameEntry> = JSON.parse(fs.readFileSync(DICT_FILE, 'utf-8'));

  const pending = Object.entries(dict).filter(
    ([, v]) => v.origin === 'Unknown' || v.confidence === 'low'
  );

  console.log(`Total: ${Object.keys(dict).length} | Pendientes de enriquecer: ${pending.length}`);

  let updated = 0;
  for (let i = 0; i < pending.length; i++) {
    const [name, entry] = pending[i];
    const result = await fetchBehindTheName(name, API_KEY);

    if (result?.origin) {
      dict[name].origin = result.origin;
      if (entry.confidence === 'low') dict[name].confidence = 'medium';
      updated++;
    }

    if (result?.genderEstimate && entry.genderEstimate === 'unisex') {
      dict[name].genderEstimate = result.genderEstimate;
    }

    // Guardar progreso cada 50 nombres
    if ((i + 1) % 50 === 0) {
      fs.writeFileSync(DICT_FILE, JSON.stringify(dict, null, 2), 'utf-8');
      console.log(`Procesados ${i + 1}/${pending.length} | Actualizados: ${updated}...`);
    }

    await sleep(RATE_LIMIT_MS);
  }

  fs.writeFileSync(DICT_FILE, JSON.stringify(dict, null, 2), 'utf-8');
  console.log(`✓ Completado. ${updated} nombres actualizados de ${pending.length} procesados.`);
}

main();
