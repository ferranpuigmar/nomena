export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

import { Timestamp } from 'firebase/firestore';

export type AuthUserDb = {
  email: string | null;
  display_name: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};