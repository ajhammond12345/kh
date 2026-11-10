import { initializeApp } from 'firebase/app'
import { initializeFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const { uploadBucket, ...firebaseConfig } = config.public.firebase
  const app = initializeApp(firebaseConfig)
  const db = initializeFirestore(app, {})
  const auth = getAuth(app)
  const storage = uploadBucket ? getStorage(app, `gs://${uploadBucket}`) : null

  return {
    provide: {
      firebaseApp: app,
      firestoreDb: db,
      firebaseAuth: auth,
      firebaseStorage: storage,
    },
  }
})
