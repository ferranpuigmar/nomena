import type { User } from 'firebase/auth';
import type { AuthUser } from '@src/features/auth/types/auth-type';

export function mapDbUserToDomain(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
}