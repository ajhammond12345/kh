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
  const role = useState<'owner' | 'admin' | null>('kh-auth-role', () => null)
  const isAdmin = computed(() => role.value !== null)
  const isOwner = computed(() => role.value === 'owner')
  // Set when a sign-in link is opened in a browser that didn't request it, so
  // the page can ask for the address (window.prompt is blocked in many mail apps).
  const linkNeedsEmail = useState('kh-auth-link-needs-email', () => false)

  async function loadRole(email: string | null | undefined) {
    role.value = null
    if (!email) return
    try {
      const snap = await getDoc(doc(getFirestoreDb(), 'admins', email.toLowerCase()))
      if (snap.exists()) role.value = snap.data().role === 'owner' ? 'owner' : 'admin'
    } catch {
      // Non-admins get permission-denied reading the admins collection
    }
  }

  function authReady(): Promise<void> {
    if (!import.meta.client) return Promise.resolve()
    if (!readyPromise) {
      readyPromise = new Promise((resolve) => {
        onAuthStateChanged(getFirebaseAuth(), async (u) => {
          user.value = u
          await loadRole(u?.email)
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
      await loadRole(cred.user.email)
    } catch (err) {
      if ((err as { code?: string })?.code === 'auth/operation-not-allowed') {
        throw new Error("Google sign-in isn't enabled yet — please use an email link instead.")
      }
      throw withFriendlyMessage(err)
    }
  }

  async function sendLoginLink(email: string, returnPath = '/admin/login') {
    try {
      await sendSignInLinkToEmail(getFirebaseAuth(), email, {
        url: `${location.origin}${returnPath}`,
        handleCodeInApp: true,
      })
    } catch (err) {
      throw withFriendlyMessage(err)
    }
    localStorage.setItem(LOGIN_EMAIL_KEY, email)
  }

  async function completeLoginLink(confirmedEmail?: string): Promise<boolean> {
    const auth = getFirebaseAuth()
    if (!isSignInWithEmailLink(auth, location.href)) return false
    const email = confirmedEmail || localStorage.getItem(LOGIN_EMAIL_KEY)
    if (!email) {
      linkNeedsEmail.value = true
      return false
    }
    let cred
    try {
      cred = await signInWithEmailLink(auth, email, location.href)
    } catch (err) {
      throw withFriendlyMessage(err)
    }
    localStorage.removeItem(LOGIN_EMAIL_KEY)
    linkNeedsEmail.value = false
    user.value = cred.user
    await loadRole(cred.user.email)
    return true
  }

  async function signOutUser() {
    await signOut(getFirebaseAuth())
    user.value = null
    role.value = null
  }

  return {
    user,
    isAdmin,
    isOwner,
    authReady,
    signInWithGoogle,
    sendLoginLink,
    completeLoginLink,
    linkNeedsEmail,
    signOutUser,
  }
}
