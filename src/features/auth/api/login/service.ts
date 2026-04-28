import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@src/lib/firebase';
import type { AuthUser } from '@src/features/auth/types/auth-type';
import { mapDbUserToDomain } from './mappers';

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return mapDbUserToDomain(userCredential.user);
}