<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm">
      <h1 class="font-display text-3xl text-charcoal-900 text-center mb-8">
        K-H Admin
      </h1>
      <form class="bg-white rounded-lg shadow-sm p-6 border border-gray-200" @submit.prevent="login">
        <div class="mb-4">
          <label class="block font-serif text-sm text-charcoal-700 mb-1">Username</label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded font-serif text-sm focus:outline-none focus:ring-2 focus:ring-gallery-gold/30"
          />
        </div>
        <div class="mb-6">
          <label class="block font-serif text-sm text-charcoal-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded font-serif text-sm focus:outline-none focus:ring-2 focus:ring-gallery-gold/30"
          />
        </div>
        <p v-if="error" class="text-red-600 font-serif text-sm mb-4">{{ error }}</p>
        <button
          type="submit"
          :disabled="submitting"
          class="w-full py-2 bg-charcoal-900 text-white font-serif rounded hover:bg-charcoal-800 transition-colors disabled:opacity-50"
        >
          {{ submitting ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const config = useRuntimeConfig()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

async function login() {
  error.value = ''
  submitting.value = true
  try {
    const res = await fetch(`${config.public.apiBase}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username: username.value, password: password.value }),
    })
    if (!res.ok) {
      error.value = 'Invalid credentials'
      return
    }
    router.push('/admin')
  } catch {
    error.value = 'Connection error'
  } finally {
    submitting.value = false
  }
}
</script>
