import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const LOGIN_EMAIL_KEY = 'kh-admin-login-email'

const FRIENDLY_AUTH_ERRORS: Record<string, string> = {
  'auth/configuration-not-found':
    "Sign-in isn't switched on for this site yet — Authentication needs enabling in the Firebase console first.",
  'auth/operation-not-allowed':
    "This sign-in method isn't enabled yet — please try the other one.",
}

function withFriendlyMessage(err: unknown): unknown {
  const friendly = FRIENDLY_AUTH_ERRORS[(err as { code?: string })?.code ?? '']
  return friendly ? new Error(friendly) : err
}

let readyPromise: Promise<void> | null = null

export function useAuth() {
  const { getFirebaseAuth, getFirestoreDb } = useFirebase()
  const user = useState<User | null>('kh-auth-user', () => null)
  const isAdmin = useState<boolean>('kh-auth-is-admin', () => false)

  async function checkAdmin(email: string | null | undefined): Promise<boolean> {
    if (!email) return false
    try {
      const snap = await getDoc(doc(getFirestoreDb(), 'admins', email.toLowerCase()))
      return snap.exists()
    } catch {
      // Non-admins get permission-denied reading the admins collection
      return false
    }
  }

  function authReady(): Promise<void> {
    if (!import.meta.client) return Promise.resolve()
    if (!readyPromise) {
      readyPromise = new Promise((resolve) => {
        onAuthStateChanged(getFirebaseAuth(), async (u) => {
          user.value = u
          isAdmin.value = await checkAdmin(u?.email)
          resolve()
        })
      })
    }
    return readyPromise
  }

  if (import.meta.client) authReady()

  async function signInWithGoogle() {
    try {
      const cred = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider())
      user.value = cred.user
      isAdmin.value = await checkAdmin(cred.user.email)
    } catch (err) {
      if ((err as { code?: string })?.code === 'auth/operation-not-allowed') {
        throw new Error("Google sign-in isn't enabled yet — please use an email link instead.")
      }
      throw withFriendlyMessage(err)
    }
  }

  async function sendLoginLink(email: string) {
    try {
      await sendSignInLinkToEmail(getFirebaseAuth(), email, {
        url: `${location.origin}/admin/login`,
        handleCodeInApp: true,
      })
    } catch (err) {
      throw withFriendlyMessage(err)
    }
    localStorage.setItem(LOGIN_EMAIL_KEY, email)
  }

  async function completeLoginLink(): Promise<boolean> {
    const auth = getFirebaseAuth()
    if (!isSignInWithEmailLink(auth, location.href)) return false
    let email = localStorage.getItem(LOGIN_EMAIL_KEY)
    if (!email) {
      email = window.prompt('Confirm the email address this sign-in link was sent to')
    }
    if (!email) return false
    let cred
    try {
      cred = await signInWithEmailLink(auth, email, location.href)
    } catch (err) {
      throw withFriendlyMessage(err)
    }
    localStorage.removeItem(LOGIN_EMAIL_KEY)
    user.value = cred.user
    isAdmin.value = await checkAdmin(cred.user.email)
    return true
  }

  async function signOutUser() {
    await signOut(getFirebaseAuth())
    user.value = null
    isAdmin.value = false
  }

  return {
    user,
    isAdmin,
    authReady,
    signInWithGoogle,
    sendLoginLink,
    completeLoginLink,
    signOutUser,
  }
}
