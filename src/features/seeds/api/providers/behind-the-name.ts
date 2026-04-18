export interface BehindTheNameResult {
  meaning?: string;
  origin?: string;
  genderEstimate?: 'boy' | 'girl' | 'neutral';
}

const RATE_LIMIT_MS = 300; // ~3 req/s en plan gratuito

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchBehindTheName(name: string, apiKey: string): Promise<BehindTheNameResult | null> {
  const url = `https://www.behindthename.com/api/lookup.json?name=${encodeURIComponent(name)}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await res.json() as any;
  if (!data || data.error) return null;

  const entry = data[0];
  const rawGender = entry?.gender;
  const genderEstimate =
    rawGender === 'm' ? 'boy' :
    rawGender === 'f' ? 'girl' :
    rawGender === 'mf' ? 'neutral' :
    undefined;

  return {
    meaning: entry?.usages?.[0]?.usage_full ?? undefined,
    origin: entry?.usages?.[0]?.usage_code ?? undefined,
    genderEstimate,
  };
}

export { RATE_LIMIT_MS };
