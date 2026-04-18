import type { Timestamp } from 'firebase/firestore';

export type NameGender = 'boy' | 'girl' | 'neutral';
export type NameLengthCategory = 'short' | 'long';

export type Name = {
  id: string;
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