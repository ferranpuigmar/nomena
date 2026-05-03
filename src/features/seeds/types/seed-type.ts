import type { Name } from '@src/features/names/types/names-type';

export type NameSeed = Name & {
  // Enrichment fields for seeding process only
  usageScoreSpain?: number; // % población general
  newbornTrendSpain?: number; // ranking recién nacidos
  usages?: string[];
  genderEstimate?: 'male' | 'female' | 'unisex';
  genderProbability?: number;
  genderSource?: string;
  isUnisex?: boolean;
  meaning?: string;
  origin?: string[];
};
