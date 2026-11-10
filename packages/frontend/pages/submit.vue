<script setup lang="ts">
import { emptyArtworkFields, type ArtworkFields } from '~/composables/useArtworkAdmin'

useHead({ title: 'Add an artwork — Knighton-Hammond Charitable Trust' })

const { user, isAdmin, authReady, completeLoginLink, signOutUser } = useAuth()
const { uploadsEnabled, submitArtwork, addArtwork } = useArtworkAdmin()

const checking = ref(true)
const linkError = ref('')

onMounted(async () => {
  try {
    await completeLoginLink()
  } catch (err) {
    linkError.value = (err as Error)?.message || 'That sign-in link could not be used. Please request a new one.'
  }
  await authReady()
  checking.value = false
})

const name = ref('')
const fields = ref<ArtworkFields>(emptyArtworkFields())
const file = ref<File | null>(null)
const sending = ref(false)
const error = ref('')
const sent = ref<'' | 'submitted' | 'published'>('')
const publishedSlug = ref('')

watch(user, (u) => {
  if (u?.displayName && !name.value) name.value = u.displayName
}, { immediate: true })

async function send() {
  error.value = ''
  if (!file.value) {
    error.value = 'Please choose a photo of the work.'
    return
  }
  if (!fields.value.title.trim()) {
    error.value = 'Please give the work a title. A short description is fine if it has none.'
    return
  }
  sending.value = true
  try {
    if (isAdmin.value) {
      publishedSlug.value = await addArtwork(fields.value, file.value)
      sent.value = 'published'
    } else {
      await submitArtwork(fields.value, file.value, name.value)
      sent.value = 'submitted'
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    error.value = (err as Error)?.message || 'Your submission could not be sent. Please try again.'
  } finally {
    sending.value = false
  }
}

function another() {
  fields.value = emptyArtworkFields()
  file.value = null
  sent.value = ''
}
</script>

<template>
  <div class="ksb">
    <div class="ksb-eyebrow">
      <span class="ksb-rule" />
      CONTRIBUTE TO THE CATALOGUE
    </div>
    <h1 class="ksb-title">Add an artwork</h1>
    <p class="ksb-lede">
      Do you own, or know of, a work by Arthur Henry Knighton-Hammond? Send the Trust a photo and
      whatever you know about it. Every submission is reviewed before it appears in the library.
    </p>

    <p v-if="checking" class="ksb-muted">Loading…</p>

    <div v-else-if="!uploadsEnabled" class="ksb-card">
      <p class="ksb-muted">Submissions aren't available on this version of the site.</p>
    </div>

    <div v-else-if="!user" class="ksb-card ksb-card--narrow">
      <h2 class="ksb-h2">Sign in to send a work</h2>
      <p class="ksb-muted ksb-why">
        We use your email address only to contact you about your submission.
      </p>
      <SignInPanel return-path="/submit" />
      <p v-if="linkError" class="kha-error ksb-error">{{ linkError }}</p>
    </div>

    <div v-else-if="sent" class="ksb-card ksb-card--narrow" role="status">
      <h2 class="ksb-h2">{{ sent === 'published' ? 'Published' : 'Thank you' }}</h2>
      <p v-if="sent === 'published'" class="ksb-body">
        The work is now in the library.
        <NuxtLink :to="`/gallery/${publishedSlug}`">View it</NuxtLink>
      </p>
      <p v-else class="ksb-body">
        The Trust will review your submission and may contact you at {{ user.email }} with questions.
      </p>
      <button class="kha-btn ksb-btn" @click="another">Send another work</button>
    </div>

    <form v-else class="ksb-card" @submit.prevent="send">
      <div class="ksb-session">
        Signed in as <strong>{{ user.email }}</strong>
        <button type="button" class="kha-link-btn" @click="signOutUser">Sign out</button>
      </div>
      <p v-if="isAdmin" class="ksb-admin-note">
        You're an administrator, so this work will be published straight away.
      </p>

      <div class="ksb-section">
        <label class="kha-label" for="submit-image">Photo</label>
        <AdminImagePicker v-model="file" id="submit-image" />
        <p class="ksb-hint">A straight-on photo in good light, with the frame cropped out if you can.</p>
      </div>

      <div v-if="!isAdmin" class="ksb-section">
        <label class="kha-label" for="submit-name">Your name</label>
        <input id="submit-name" v-model="name" type="text" class="kha-input" autocomplete="name" maxlength="200" />
      </div>

      <div class="ksb-section">
        <AdminArtworkFieldsForm v-model="fields" :variant="isAdmin ? 'admin' : 'public'" id-prefix="submit" />
      </div>

      <p v-if="error" class="kha-error ksb-error" role="alert">{{ error }}</p>
      <button type="submit" class="kha-btn ksb-btn" :disabled="sending">
        {{ sending ? 'Uploading…' : isAdmin ? 'Publish artwork' : 'Send to the Trust' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.ksb {
  max-width: 760px;
  margin: 64px auto 0;
  padding: 0 32px 96px;
}
.ksb-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.2em;
  font-weight: 600;
  color: var(--ink-3);
  margin-bottom: 16px;
}
.ksb-rule {
  display: inline-block;
  width: 24px;
  height: 1px;
  background: var(--sienna);
}
.ksb-title {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin: 0 0 20px;
}
.ksb-lede {
  font-family: var(--font-body);
  font-size: 18px;
  line-height: 1.6;
  color: var(--ink-2);
  max-width: 60ch;
  margin: 0 0 40px;
}
.ksb-card {
  background: var(--paper-2);
  border: 1px solid var(--hairline);
  border-radius: 14px;
  padding: 32px;
}
.ksb-card--narrow {
  max-width: 440px;
}
.ksb-h2 {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 8px;
}
.ksb-why {
  margin: 0 0 24px;
}
.ksb-muted,
.ksb-body {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.55;
  color: var(--ink-3);
}
.ksb-body {
  color: var(--ink-2);
  margin: 0 0 20px;
}
.ksb-body a {
  color: var(--sienna);
}
.ksb-session {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 12px;
  font-family: var(--font-ui);
  font-size: 13px;
  color: var(--ink-3);
  margin-bottom: 24px;
  overflow-wrap: anywhere;
}
.ksb-session strong {
  color: var(--ink);
}
.ksb-admin-note {
  font-family: var(--font-ui);
  font-size: 13px;
  color: var(--ink);
  background: var(--sienna-wash);
  border-radius: 8px;
  padding: 10px 14px;
  margin: -8px 0 24px;
}
.ksb-section {
  margin-bottom: 24px;
}
.ksb-hint {
  font-family: var(--font-ui);
  font-size: 12.5px;
  color: var(--ink-3);
  margin: 8px 0 0;
}
.ksb-error {
  margin: 0 0 16px;
}
.ksb-btn {
  min-height: 46px;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 14px;
}

@media (max-width: 640px) {
  .ksb {
    margin-top: 40px;
    padding: 0 20px 72px;
  }
  .ksb-title {
    font-size: 36px;
  }
  .ksb-card {
    padding: 22px 18px;
  }
}
</style>
