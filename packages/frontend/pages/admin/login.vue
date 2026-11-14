<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const { user, isAdmin, authReady, completeLoginLink, signOutUser } = useAuth()

const checking = ref(true)
const error = ref('')

const notAuthorised = computed(
  () => !checking.value && !!user.value && !isAdmin.value,
)

// Watched rather than triggered by the sign-in panel: the user is set a beat
// before their role loads, which briefly swaps the panel for the
// "not authorised" note and would swallow an event from it.
watch(isAdmin, (admin) => {
  if (admin && !checking.value) router.replace('/admin')
})

onMounted(async () => {
  try {
    await completeLoginLink()
  } catch (err) {
    error.value = (err as Error)?.message || 'That sign-in link could not be used. Please request a new one.'
  }
  await authReady()
  checking.value = false
  if (isAdmin.value) router.replace('/admin')
})

async function switchAccount() {
  await signOutUser()
  router.replace({ path: '/admin/login' })
}
</script>

<template>
  <div class="kh kh-paper-grain khl-page">
    <div class="khl-card">
      <div class="khl-brand">
        <div class="khl-brand-name">Knighton-Hammond</div>
        <div class="khl-brand-sub">
          <span :style="{ width: '18px', height: '1px', background: 'var(--sienna)', display: 'inline-block' }" />
          ADMINISTRATION
        </div>
      </div>

      <div v-if="checking" class="khl-note">Checking your session…</div>

      <template v-else-if="notAuthorised">
        <p class="khl-note">
          Signed in as <strong>{{ user?.email }}</strong>. This account isn't
          authorised to administer the catalogue.
        </p>
        <p v-if="route.query.unauthorised" class="khl-note khl-note--muted">
          Ask the site owner to add your email address.
        </p>
        <button class="kha-btn khl-full" @click="switchAccount">
          Sign in with a different account
        </button>
      </template>

      <SignInPanel v-else />

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
  max-width: 400px;
  background: var(--paper-2);
  border: 1px solid var(--hairline);
  border-radius: 14px;
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
  min-height: 46px;
  border-radius: 8px;
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
