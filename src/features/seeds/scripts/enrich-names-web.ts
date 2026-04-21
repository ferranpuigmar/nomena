import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DICT_FILE = path.resolve(__dirname, '../files/nameDictionary-enriched-full.json');
const OUTPUT_FILE = path.resolve(__dirname, '../files/nameDictionary-enriched-full-web.json');

interface NameEntry {
  meaning?: string;
  origin?: string;
  genderEstimate?: string;
  confidence?: string;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isGenericMeaning(meaning?: string) {
  return meaning?.startsWith('Nombre de origen incierto cuyo uso actual sugiere una asociación con identidad, personalidad y una sonoridad distintiva.');
}

async function fetchFromBehindTheName(name: string): Promise<{meaning?: string, origin?: string} | null> {
  const url = `https://www.behindthename.com/name/${encodeURIComponent(name.toLowerCase())}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const html = await res.text();
    // Extraer significado
    const match = html.match(/Meaning & History<\/h2>\s*<p>(.*?)<\//s);
    const meaning = match ? match[1].replace(/<.*?>/g, '').replace(/\s+/g, ' ').trim() : undefined;
    // Extraer origen
    const usageMatch = html.match(/Usage ([^<]+)/);
    const origin = usageMatch ? usageMatch[1].replace(/\s+/g, ' ').trim() : undefined;
    if (meaning || origin) return { meaning, origin };
    return null;
  } catch {
    return null;
  }
}

async function main() {
  const dict: Record<string, NameEntry> = JSON.parse(fs.readFileSync(DICT_FILE, 'utf-8'));
  let updated = 0;
  for (const [name, entry] of Object.entries(dict)) {
    if (isGenericMeaning(entry.meaning) || entry.origin === 'Unknown') {
      const btn = await fetchFromBehindTheName(name);
      if (btn) {
        if (btn.meaning && btn.meaning.length > 10) dict[name].meaning = btn.meaning;
        if (btn.origin && btn.origin.length > 2) dict[name].origin = btn.origin;
        dict[name].confidence = 'web';
        updated++;
        console.log(`Enriquecido: ${name}`);
      }
      await sleep(1200); // Evita bloqueo por scraping
    }
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dict, null, 2), 'utf-8');
  console.log(`✓ ${updated} nombres enriquecidos y guardados en ${OUTPUT_FILE}`);
}

main();
