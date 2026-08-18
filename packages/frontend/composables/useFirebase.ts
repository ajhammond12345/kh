import type { FirebaseApp } from 'firebase/app'
import type { Firestore } from 'firebase/firestore'
import type { Auth } from 'firebase/auth'

export function useFirebase() {
  const { $firebaseApp, $firestoreDb, $firebaseAuth } = useNuxtApp()
  return {
    getFirebaseApp: () => $firebaseApp as FirebaseApp,
    getFirestoreDb: () => $firestoreDb as Firestore,
    getFirebaseAuth: () => $firebaseAuth as Auth,
  }
}
