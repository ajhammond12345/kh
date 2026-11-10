import type { FirebaseApp } from 'firebase/app'
import type { Firestore } from 'firebase/firestore'
import type { Auth } from 'firebase/auth'
import type { FirebaseStorage } from 'firebase/storage'

export function useFirebase() {
  const { $firebaseApp, $firestoreDb, $firebaseAuth, $firebaseStorage } = useNuxtApp()
  return {
    getFirebaseApp: () => $firebaseApp as FirebaseApp,
    getFirestoreDb: () => $firestoreDb as Firestore,
    getFirebaseAuth: () => $firebaseAuth as Auth,
    // null where the project has no upload bucket (dev, which is unbilled)
    getUploadStorage: () => $firebaseStorage as FirebaseStorage | null,
  }
}
