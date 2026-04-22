import { Timestamp } from 'firebase/firestore';

export type InviteCode = {
  code: string;
  userId: string;
  createdAt: Date;
};

export type InviteCodeDb = {
  code: string;
  user_id: string;
  created_at: Timestamp;
};

export const INVITE_CODE_TTL_MS = 48 * 60 * 60 * 1000; // 48 hours
