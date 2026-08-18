<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const { user, isAdmin, authReady, signInWithGoogle, sendLoginLink, completeLoginLink, signOutUser } = useAuth()

const checking = ref(true)
const error = ref('')
const email = ref('')
const sending = ref(false)
const sentTo = ref('')
const signingIn = ref(false)

const notAuthorised = computed(
  () => !checking.value && !!user.value && !isAdmin.value,
)

onMounted(async () => {
  try {
    await completeLoginLink()
  } catch (err) {
    error.value = (err as Error)?.message || 'That sign-in link could not be used. Please request a new one.'
  }
  await authReady()
  checking.value = false
  if (user.value && isAdmin.value) router.replace('/admin')
})

async function googleSignIn() {
  error.value = ''
  signingIn.value = true
  try {
    await signInWithGoogle()
    if (isAdmin.value) router.replace('/admin')
  } catch (err) {
    error.value = (err as Error)?.message || 'Sign-in failed. Please try again.'
  } finally {
    signingIn.value = false
  }
}

async function submitEmail() {
  error.value = ''
  const address = email.value.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
    error.value = 'Please enter a valid email address.'
    return
  }
  sending.value = true
  try {
    await sendLoginLink(address)
    sentTo.value = address
  } catch {
    error.value = 'The sign-in link could not be sent. Please try again.'
  } finally {
    sending.value = false
  }
}

async function switchAccount() {
  await signOutUser()
  router.replace({ path: '/admin/login' })
}
</script>

<template>
  <div class="kh kh-paper-grain khl-page">
    <div class="khl-card">
      <div class="khl-brand">
        <div class="khl-brand-name">Knighton Hammond</div>
        <div class="khl-brand-sub">
          <span :style="{ width: '18px', height: '1px', background: 'var(--sienna)', display: 'inline-block' }" />
          ADMINISTRATION
        </div>
      </div>

      <div v-if="checking" class="khl-note">Checking your session…</div>

      <template v-else-if="notAuthorised">
        <p class="khl-note">
          Signed in as <strong>{{ user?.email }}</strong> — this account isn't
          authorised to administer the catalogue.
        </p>
        <p v-if="route.query.unauthorised" class="khl-note khl-note--muted">
          Ask an existing administrator to add your email address.
        </p>
        <button class="kha-btn khl-full" @click="switchAccount">
          Sign in with a different account
        </button>
      </template>

      <template v-else>
        <button class="kha-btn khl-full" :disabled="signingIn" @click="googleSignIn">
          {{ signingIn ? 'Signing in…' : 'Sign in with Google' }}
        </button>

        <div class="khl-divider"><span>or</span></div>

        <div v-if="sentTo" class="khl-note">
          Check your inbox — we've sent a sign-in link to
          <strong>{{ sentTo }}</strong>. Open it on this device to finish signing in.
        </div>
        <form v-else @submit.prevent="submitEmail">
          <label class="kha-label" for="login-email">Email address</label>
          <input
            id="login-email"
            v-model="email"
            type="email"
            class="kha-input"
            placeholder="you@example.org"
            autocomplete="email"
          />
          <button type="submit" class="kha-btn kha-btn--ghost khl-full khl-send" :disabled="sending">
            {{ sending ? 'Sending…' : 'Send me a sign-in link' }}
          </button>
        </form>
      </template>

      <p v-if="error" class="kha-error khl-error">{{ error }}</p>

      <NuxtLink to="/" class="khl-back">← Back to the site</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.khl-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
}
.khl-card {
  width: 100%;
  max-width: 380px;
  background: var(--paper-2);
  border: 1px solid var(--hairline);
  padding: 40px 36px 32px;
  box-shadow: var(--shadow-2);
}
.khl-brand {
  text-align: center;
  margin-bottom: 32px;
}
.khl-brand-name {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -0.005em;
  color: var(--ink);
}
.khl-brand-sub {
  font-family: var(--font-ui);
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--ink-3);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 6px;
}
.khl-full {
  width: 100%;
  padding: 12px 18px;
}
.khl-send {
  margin-top: 12px;
  font-size: 13px;
}
.khl-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.khl-divider::before,
.khl-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--hairline);
}
.khl-note {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.55;
  color: var(--ink-2);
  margin: 0 0 16px;
}
.khl-note--muted {
  color: var(--ink-3);
  font-size: 14px;
}
.khl-error {
  margin: 16px 0 0;
}
.khl-back {
  display: block;
  margin-top: 28px;
  text-align: center;
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 600;
  color: var(--sienna);
  text-decoration: none;
}
</style>
