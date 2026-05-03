import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { load, type CheerioAPI } from 'cheerio';
import { sleep, RATE_LIMIT_MS } from '../api/providers/behind-the-name';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const NAMES_FILE = path.resolve(__dirname, '../files/names.json');

interface Name {
  id: string;
  name: string;
  normalized_name: string;
  gender: string;
  meaning: string;
  origin: string[];
  [key: string]: unknown;
}

interface FetchResult {
  meaning: string;
  origins: string[];
}

// Gender indicator used by behindthename in browse blocks: "m", "f", "mf"
const BTN_GENDER_MAP: Record<string, string> = { m: 'boy', f: 'girl', mf: 'unisex' };

function cleanMeaning(html: string): string {
  let cleaned = html.replace(/<a[^>]*>([^<]*)<\/a>/g, '$1');
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  cleaned = cleaned
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/\b(Expand Links|expand links|EXPAND LINKS)\b/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  cleaned = cleaned.replace(/^[\s\-—–]+|[\s\-—–]+$/g, '').trim();
  return cleaned;
}

function extractUsagesFromPage($: CheerioAPI): string[] {
  // On a direct variant page (e.g. /name/kai-1) usage links appear in the name
  // info box alongside the .namedef section.
  const seen = new Set<string>();
  $('a[href*="/names/usage/"]').each((_, el) => {
    const text = $(el).text().trim();
    if (text) seen.add(text);
  });
  return Array.from(seen);
}

interface BrowseVariant {
  link: string;       // e.g. "/name/kai-1"
  usages: string[];   // e.g. ["Frisian", "German", ...]
  gender: string;     // "boy" | "girl" | "unisex" | ""
}

function extractBrowseVariants($: CheerioAPI): BrowseVariant[] {
  return $('.browsename').toArray().map((block) => {
    const blockRoot = $(block);

    const link = blockRoot.find('.listname a[href^="/name/"]').first().attr('href') ?? '';

    const usages = blockRoot
      .find('.listusage a[href*="/names/usage/"]')
      .toArray()
      .map((el) => $(el).text().trim())
      .filter(Boolean);

    // Gender badge sits inside .browsename as a small indicator like "m", "f", "mf"
    const rawGender = blockRoot.find('.browsegendef').first().text().trim().toLowerCase();
    const gender = BTN_GENDER_MAP[rawGender] ?? '';

    return { link, usages, gender };
  });
}

function pickBestVariant(variants: BrowseVariant[], gender: string): BrowseVariant | undefined {
  // 1. Prefer catalan or spanish usage (keeps existing behaviour for Iberian names)
  const iberian = variants.find(v =>
    v.usages.some(u => u.toLowerCase().includes('catalan') || u.toLowerCase().includes('spanish'))
  );
  if (iberian) return iberian;

  // 2. Prefer a variant whose gender matches the name entry
  const genderMatch = variants.find(v => v.gender === gender || v.gender === 'unisex');
  if (genderMatch) return genderMatch;

  // 3. Fall back to the first variant (typically the most common one)
  return variants[0];
}

async function fetchNameData(normalizedName: string, gender: string): Promise<FetchResult | null> {
  try {
    const url = `https://www.behindthename.com/name/${encodeURIComponent(normalizedName)}`;
    let response = await fetch(url);

    if (!response.ok) {
      console.error(`❌ HTTP ${response.status} para ${normalizedName}`);
      return null;
    }

    let html = await response.text();
    let $ = load(html);

    // Happy path: direct name page already contains Meaning & History.
    let meaningElement = $('.namedef');

    // Collect origins from the current page (works for both direct and disambiguation pages).
    // Will be refined below if we follow a variant link.
    let origins = extractUsagesFromPage($);

    // Disambiguation / multi-entry page: no .namedef on this page.
    if (!meaningElement.length) {
      const variants = extractBrowseVariants($);

      if (variants.length > 0) {
        // Collect ALL origins from every variant listed on this page.
        const allOrigins = new Set<string>();
        variants.forEach(v => v.usages.forEach(u => allOrigins.add(u)));
        origins = Array.from(allOrigins);

        const best = pickBestVariant(variants, gender);
        if (best?.link) {
          const variantUrl = `https://www.behindthename.com${best.link}`;
          const label = best.usages.length ? best.usages.slice(0, 2).join('/') : best.link;
          console.log(`  → Siguiendo variante [${label}]: ${best.link}`);

          await sleep(RATE_LIMIT_MS);
          response = await fetch(variantUrl);
          if (response.ok) {
            html = await response.text();
            $ = load(html);
            meaningElement = $('.namedef');
          } else {
            console.warn(`⚠️  HTTP ${response.status} al abrir variante para ${normalizedName}`);
          }
        }
      }
    }

    if (!meaningElement.length) {
      console.warn(`⚠️  No se encontró elemento con clase 'namedef' para ${normalizedName}`);
      return null;
    }

    const meaningText = meaningElement.html();
    if (!meaningText) {
      console.warn(`⚠️  'Meaning & History' vacío para ${normalizedName}`);
      return null;
    }

    const meaning = cleanMeaning(meaningText);

    // If we ended up on a direct variant page, also pull its usages (in case the
    // disambiguation page listed fewer usages than the variant detail page shows).
    if (origins.length === 0) {
      origins = extractUsagesFromPage($);
    }

    console.log(`✓ ${normalizedName}: ${meaning.substring(0, 80)}...`);
    if (origins.length) console.log(`  origins: ${origins.join(', ')}`);

    return { meaning, origins };
  } catch (error) {
    console.error(`❌ Error procesando ${normalizedName}:`, error);
    return null;
  }
}

async function main() {
  if (!fs.existsSync(NAMES_FILE)) {
    throw new Error(`No se encuentra ${NAMES_FILE}`);
  }

  const names: Name[] = JSON.parse(fs.readFileSync(NAMES_FILE, 'utf-8'));

  // Filter names that need enrichment: missing meaning OR empty origin
  const pending = names.filter(name => name.meaning === '' || name.origin.length === 0);

  const pendingMeaning = pending.filter(n => n.meaning === '').length;
  const pendingOrigin = pending.filter(n => n.origin.length === 0).length;

  console.log(
    `Total: ${names.length} | Pendientes: ${pending.length} (sin meaning: ${pendingMeaning}, sin origin: ${pendingOrigin})\n`
  );

  let updated = 0;
  let failed = 0;

  const stopAt = process.env.STOP_AT_NAME?.toLowerCase();

  for (let i = 0; i < pending.length; i++) {
    const name = pending[i];
    const result = await fetchNameData(name.normalized_name, name.gender);

    if (result) {
      if (name.meaning === '') name.meaning = result.meaning;
      if (result.origins.length > 0) {
        // Merge with existing origins, keeping deduped values.
        const merged = Array.from(new Set([...(name.origin ?? []), ...result.origins]));
        name.origin = merged;
      }
      updated++;
    } else {
      failed++;
    }

    // Save progress every 10 names
    if ((i + 1) % 10 === 0) {
      fs.writeFileSync(NAMES_FILE, JSON.stringify(names, null, 2), 'utf-8');
      console.log(
        `Procesados ${i + 1}/${pending.length} | Actualizados: ${updated} | Fallidos: ${failed}...\n`
      );
    }

    // Rate limiting to be respectful to the server
    await sleep(RATE_LIMIT_MS);

    if (stopAt && name.normalized_name === stopAt) {
      console.log(`\n⏹  STOP_AT_NAME="${stopAt}" alcanzado, parando.`);
      break;
    }
  }

  fs.writeFileSync(NAMES_FILE, JSON.stringify(names, null, 2), 'utf-8');
  console.log(
    `✓ Completado. ${updated} nombres actualizados de ${pending.length} procesados. ${failed} fallidos.`
  );
}

main().catch(console.error);
