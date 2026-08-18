<script setup lang="ts">
const { user, signOutUser } = useAuth()
const router = useRouter()

async function signOut() {
  await signOutUser()
  router.push('/admin/login')
}
</script>

<template>
  <div class="kh kh-paper-grain" :style="{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }">
    <header class="kha-header">
      <NuxtLink to="/" class="kha-brand">
        <span class="kha-brand-name">Knighton Hammond</span>
        <span class="kha-brand-sub">
          <span :style="{ width: '18px', height: '1px', background: 'var(--sienna)', display: 'inline-block' }" />
          ADMINISTRATION
        </span>
      </NuxtLink>
      <nav class="kha-nav">
        <NuxtLink to="/admin" class="kha-nav-link">Overview</NuxtLink>
        <NuxtLink to="/admin/artworks" class="kha-nav-link">Artworks</NuxtLink>
        <NuxtLink to="/admin/users" class="kha-nav-link">Users</NuxtLink>
      </nav>
      <div class="kha-session">
        <span class="kha-session-email">{{ user?.email }}</span>
        <button class="kha-btn kha-btn--ghost" @click="signOut">Sign out</button>
      </div>
    </header>
    <main :style="{ flex: 1, width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '48px 32px 96px' }">
      <slot />
    </main>
  </div>
</template>

<style>
.kha-header {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 14px 32px;
  border-bottom: 1px solid var(--hairline);
  background: rgb(246 241 231 / 0.86);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 50;
}
.kha-brand {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
  text-decoration: none;
  color: inherit;
}
.kha-brand-name {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 500;
  letter-spacing: -0.005em;
}
.kha-brand-sub {
  font-family: var(--font-ui);
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--ink-3);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 3px;
}
.kha-nav {
  display: flex;
  gap: 22px;
  align-items: center;
  flex: 1;
}
.kha-nav-link {
  position: relative;
  font-family: var(--font-ui);
  font-size: 13.5px;
  font-weight: 500;
  color: var(--ink-2);
  text-decoration: none;
  padding: 6px 0;
}
.kha-nav-link.router-link-active {
  color: var(--ink);
}
.kha-nav-link.router-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 1px;
  background: var(--sienna);
}
.kha-session {
  display: flex;
  align-items: center;
  gap: 14px;
}
.kha-session-email {
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--ink-3);
}

.kha-title {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin: 0 0 32px;
}
.kha-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.2em;
  font-weight: 600;
  color: var(--ink-3);
  margin-bottom: 16px;
  text-transform: uppercase;
}
.kha-eyebrow::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 1px;
  background: var(--sienna);
}
.kha-card {
  background: var(--paper-2);
  border: 1px solid var(--hairline);
  padding: 24px;
}
.kha-btn {
  font-family: var(--font-ui);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: var(--ink);
  color: #FAF6EC;
  border: 0;
  border-radius: 2px;
  padding: 10px 18px;
  cursor: pointer;
}
.kha-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.kha-btn--ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--hairline);
  padding: 7px 14px;
  font-size: 12px;
}
.kha-btn--danger {
  background: transparent;
  color: var(--sienna-2);
  border: 0;
  padding: 6px 0;
  font-size: 12px;
  font-weight: 600;
}
.kha-link-btn {
  background: transparent;
  border: 0;
  padding: 6px 0;
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 600;
  color: var(--sienna);
  cursor: pointer;
}
.kha-label {
  display: block;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
  margin-bottom: 6px;
}
.kha-input,
.kha-textarea {
  width: 100%;
  padding: 9px 12px;
  font-family: var(--font-ui);
  font-size: 14px;
  color: var(--ink);
  background: var(--paper);
  border: 1px solid var(--hairline);
  border-radius: 3px;
}
.kha-textarea {
  font-family: var(--font-body);
  line-height: 1.55;
  resize: vertical;
}
.kha-error {
  font-family: var(--font-ui);
  font-size: 13px;
  color: var(--sienna-2);
}
.kha-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-ui);
  font-size: 13.5px;
}
.kha-table th {
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
  padding: 10px 12px;
  border-bottom: 1px solid var(--ink);
}
.kha-table td {
  padding: 10px 12px;
  border-bottom: 1px solid var(--hairline);
  color: var(--ink-2);
  vertical-align: middle;
}
.kha-badge {
  display: inline-block;
  font-family: var(--font-ui);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 2px;
  background: var(--sienna-wash);
  color: var(--sienna-2);
}
</style>
