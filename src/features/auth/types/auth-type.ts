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

export type ActionType = {
  ADD_FAVORITE: 'ADD_FAVORITE',
  ANY_ACTION: 'ANY_ACTION', // Placeholder for future actions
};

export type ActionTypeValue = ActionType[keyof ActionType];

type ADD_FAVORITE_ACTION = {
  type: ActionType['ADD_FAVORITE'];
  payload: {
    nameId: string;
    name: string;
  };
}

export type PendingAction = ADD_FAVORITE_ACTION | null;