<script setup lang="ts">
const props = withDefaults(defineProps<{ returnPath?: string }>(), { returnPath: '/admin/login' })
const emit = defineEmits<{ signedIn: [] }>()

const { signInWithGoogle, sendLoginLink } = useAuth()

const email = ref('')
const sending = ref(false)
const sentTo = ref('')
const signingIn = ref(false)
const error = ref('')

async function googleSignIn() {
  error.value = ''
  signingIn.value = true
  try {
    await signInWithGoogle()
    emit('signedIn')
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
    await sendLoginLink(address, props.returnPath)
    sentTo.value = address
  } catch {
    error.value = 'The sign-in link could not be sent. Please try again.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="ksp">
    <button class="ksp-google" :disabled="signingIn" @click="googleSignIn">
      <svg class="ksp-g" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      </svg>
      {{ signingIn ? 'Signing in…' : 'Continue with Google' }}
    </button>

    <div class="ksp-divider"><span>or use your email</span></div>

    <div v-if="sentTo" class="ksp-sent" role="status">
      <strong>Check your inbox.</strong>
      We've sent a sign-in link to {{ sentTo }}. Open it on this device to finish signing in.
      <button class="kha-link-btn" @click="sentTo = ''">Use a different address</button>
    </div>
    <form v-else class="ksp-form" @submit.prevent="submitEmail">
      <label class="ksp-label" for="login-email">Email address</label>
      <div class="ksp-field">
        <svg class="ksp-field-icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.6" />
          <path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <input
          id="login-email"
          v-model="email"
          type="email"
          class="kha-input ksp-input"
          placeholder="you@example.org"
          autocomplete="email"
          inputmode="email"
          required
        />
      </div>
      <button type="submit" class="kha-btn ksp-send" :disabled="sending">
        {{ sending ? 'Sending…' : 'Email me a sign-in link' }}
      </button>
    </form>

    <p v-if="error" class="kha-error ksp-error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.ksp {
  display: flex;
  flex-direction: column;
}
.ksp-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  min-height: 46px;
  padding: 10px 16px;
  font-family: var(--font-ui);
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink);
  background: #FFFDF8;
  border: 1px solid rgb(22 26 34 / 0.18);
  border-radius: 8px;
  box-shadow: 0 1px 2px rgb(22 26 34 / 0.05);
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.ksp-google:hover {
  border-color: rgb(22 26 34 / 0.34);
  box-shadow: 0 2px 6px rgb(22 26 34 / 0.08);
}
.ksp-google:focus-visible {
  outline: 2px solid var(--sienna);
  outline-offset: 2px;
}
.ksp-google:disabled {
  opacity: 0.6;
  cursor: progress;
}
.ksp-g {
  width: 18px;
  height: 18px;
}
.ksp-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0;
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--ink-3);
}
.ksp-divider::before,
.ksp-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--hairline);
}
.ksp-form {
  display: flex;
  flex-direction: column;
}
.ksp-label {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-2);
  margin-bottom: 8px;
}
.ksp-field {
  position: relative;
}
.ksp-field-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  width: 18px;
  height: 18px;
  transform: translateY(-50%);
  color: var(--ink-3);
  pointer-events: none;
}
.ksp-input {
  min-height: 46px;
  padding-left: 42px;
}
.ksp-send {
  margin-top: 12px;
  min-height: 46px;
  font-size: 14px;
  border-radius: 8px;
}
.ksp-sent {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 14px 16px;
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.5;
  color: var(--ink-2);
  background: var(--sienna-wash);
  border-radius: 8px;
  overflow-wrap: anywhere;
}
.ksp-sent strong {
  color: var(--ink);
}
.ksp-error {
  margin: 14px 0 0;
}
</style>
