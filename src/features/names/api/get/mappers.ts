import type { Name, NameDb, NameLengthCategory, NameGender } from '../../types/api-type';

function mapRawGenderToDb(value: unknown): NameGender {
  return value === 'boy' || value === 'girl' || value === 'neutral' ? value : 'neutral';
}

function mapRawLengthCategoryToDb(value: unknown): NameLengthCategory {
  return value === 'short' || value === 'long' ? value : 'long';
}

function mapRawCreatedAtToDate(value: unknown): Date | undefined {
  if (value && typeof value === 'object' && 'toDate' in value) {
    const toDate = (value as { toDate?: unknown }).toDate;
    if (typeof toDate === 'function') {
      return toDate();
    }
  }

  return value instanceof Date ? value : undefined;
}

export function normalizeDbName(
  raw: Partial<NameDb> & Record<string, unknown>
): NameDb {
  return {
    name: typeof raw.name === 'string' ? raw.name : '',
    normalized_name: typeof raw.normalized_name === 'string' ? raw.normalized_name : '',
    gender: mapRawGenderToDb(raw.gender),
    meaning: typeof raw.meaning === 'string' ? raw.meaning : undefined,
    origin: typeof raw.origin === 'string' ? raw.origin : undefined,
    length: typeof raw.length === 'number' ? raw.length : 0,
    length_category: mapRawLengthCategoryToDb(raw.length_category),
    spain_usage_rank: typeof raw.spain_usage_rank === 'number' ? raw.spain_usage_rank : undefined,
    created_at: raw.created_at,
  };
}

export function mapDbNameToDomain(id: string, dbModel: NameDb): Name {
  return {
    id,
    name: dbModel.name,
    normalizedName: dbModel.normalized_name,
    gender: dbModel.gender,
    meaning: dbModel.meaning,
    origin: dbModel.origin,
    length: dbModel.length,
    lengthCategory: dbModel.length_category,
    spainUsageRank: dbModel.spain_usage_rank,
    createdAt: mapRawCreatedAtToDate(dbModel.created_at),
  };
}