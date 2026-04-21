import type { User } from 'firebase/auth';
import type { AuthUser, AuthUserDb } from '../../types/auth-type';

export function mapDbUserToDomain(
  user: User,
  displayName: string | null = user.displayName
): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName,
  };
}

export function readDisplayNameFromUserDb(
  raw: Partial<AuthUserDb> & Record<string, unknown>
): string | null {
  return typeof raw.display_name === 'string' ? raw.display_name : null;
}