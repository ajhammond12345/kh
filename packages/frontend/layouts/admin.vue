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
        <span class="kha-brand-name">Knighton-Hammond</span>
        <span class="kha-brand-sub">
          <span :style="{ width: '18px', height: '1px', background: 'var(--sienna)', display: 'inline-block' }" />
          ADMINISTRATION
        </span>
      </NuxtLink>
      <nav class="kha-nav">
        <NuxtLink to="/admin" class="kha-nav-link">Overview</NuxtLink>
        <NuxtLink to="/admin/artworks" class="kha-nav-link">Artworks</NuxtLink>
        <NuxtLink to="/admin/submissions" class="kha-nav-link">Submissions</NuxtLink>
        <NuxtLink to="/admin/users" class="kha-nav-link">Users</NuxtLink>
      </nav>
      <div class="kha-session">
        <span class="kha-session-email">{{ user?.email }}</span>
        <button class="kha-btn kha-btn--ghost" @click="signOut">Sign out</button>
      </div>
    </header>
    <main :style="{ flex: 1, width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '48px clamp(20px, 4vw, 32px) 96px' }">
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

@media (max-width: 760px) {
  .kha-header {
    flex-wrap: wrap;
    gap: 10px 16px;
    padding: 12px 20px;
  }
  .kha-session {
    margin-left: auto;
  }
  .kha-session-email {
    display: none;
  }
  .kha-nav {
    order: 3;
    flex-basis: 100%;
    overflow-x: auto;
    gap: 18px;
  }
}

</style>
