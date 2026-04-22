import type { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
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

export function mapDomainToDb(domain: AuthUser): AuthUserDb {
  return {
    email: domain.email,
    display_name: domain.displayName,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  };
}