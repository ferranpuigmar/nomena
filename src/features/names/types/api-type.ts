import type { Timestamp } from 'firebase/firestore';

export type NameGender = 'boy' | 'girl' | 'neutral';
export type NameLengthCategory = 'short' | 'long';

export type NameDb = {
  name: string;
  normalized_name: string;
  gender: NameGender;
  meaning?: string;
  origin?: string;
  length: number;
  length_category: NameLengthCategory;
  spain_usage_rank?: number;
  created_at?: Timestamp;
};

export type Name = {
  id: string;
  name: string;
  normalizedName: string;
  gender: NameGender;
  meaning?: string;
  origin?: string;
  length: number;
  lengthCategory: NameLengthCategory;
  spainUsageRank?: number;
  createdAt?: Date;
};