export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export type AuthUserDb = {
  email: string | null;
  display_name: string | null;
  created_at: Date;
  updated_at: Date;
};