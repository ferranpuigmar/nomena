import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@src/lib/firebase';
import type { AuthUser } from '@src/features/auth/types/auth-type';
import { mapDbUserToDomain, mapDomainToDb } from './mappers';

export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const domainUser = mapDbUserToDomain(userCredential.user, displayName);

  await setDoc(doc(db, 'users', domainUser.uid), mapDomainToDb(domainUser));

  return domainUser;
}