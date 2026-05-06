import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@src/lib/firebase';

export async function uploadAvatar(uid: string, file: File): Promise<string> {
  const storageRef = ref(storage, `users/${uid}/avatar`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  await updateDoc(doc(db, 'users', uid), { avatar_url: url });
  return url;
}
