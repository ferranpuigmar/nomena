import type { Timestamp } from 'firebase/firestore';

export type NameGender = 'boy' | 'girl' | 'unisex';
export type NameLengthCategory = 'short' | 'long';

export type NameDb = {
  name: string;
  normalized_name: string;
  gender: NameGender;
  meaning?: string;
  origin?: string;
  length: number;
  length_category: NameLengthCategory;
  usage_score?: number;
  spain_usage_rank?: number;
  created_at?: Timestamp;
};

export type NumberRange = {
  min: number;
  max: number;
}

export type Filters = {
  gender: NameGender[] | null;
  usageScore: NumberRange | null;
  length_category: NameLengthCategory[] | null;
}

export type Name = {
  id: string;
  name: string;
  normalizedName: string;
  gender: NameGender;
  meaning?: string;
  origin?: string;
  length: number;
  lengthCategory: NameLengthCategory;
  usageScore?: number;
  spainUsageRank?: number;
  createdAt?: Date;
};