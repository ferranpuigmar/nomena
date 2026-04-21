import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../../../../lib/firebase';

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}