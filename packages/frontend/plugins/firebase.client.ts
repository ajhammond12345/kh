import { initializeApp } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const app = initializeApp(config.public.firebase)
  const db = initializeFirestore(app, {})
  const auth = getAuth(app)

  return {
    provide: {
      firebaseApp: app,
      firestoreDb: db,
      firebaseAuth: auth,
    },
  }
})
