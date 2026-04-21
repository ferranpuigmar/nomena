import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../../lib/firebase';
import type { AuthUser } from '../../types/auth-type';
import { mapDbUserToDomain } from './mappers';

export async function loginUser(email: string, password: string): Promise<AuthUser> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return mapDbUserToDomain(userCredential.user);
}