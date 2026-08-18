<script setup lang="ts">
import { collection, doc, getCountFromServer, getDoc } from 'firebase/firestore'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Admin — Knighton-Hammond' })

const { getFirestoreDb } = useFirebase()

const stats = ref<{ artworks: number | null; published: number | null; admins: number | null }>({
  artworks: null,
  published: null,
  admins: null,
})

onMounted(async () => {
  const db = getFirestoreDb()
  const [artworks, catalogSnap, admins] = await Promise.all([
    getCountFromServer(collection(db, 'artworks')),
    getDoc(doc(db, 'catalog', 'artworks')),
    getCountFromServer(collection(db, 'admins')),
  ])
  stats.value = {
    artworks: artworks.data().count,
    published: catalogSnap.exists() ? (catalogSnap.data().count as number) : 0,
    admins: admins.data().count,
  }
})

const cards = [
  {
    to: '/admin/artworks',
    title: 'Artworks',
    body: 'Edit catalogue entries, publish or withdraw works, and keep the public library in order.',
  },
  {
    to: '/admin/users',
    title: 'Users',
    body: 'Manage who may administer the catalogue.',
  },
]
</script>

<template>
  <div>
    <div class="kha-eyebrow">THE CATALOGUE ROOM</div>
    <h1 class="kha-title">Administration</h1>

    <div class="khd-stats">
      <div class="khd-stat">
        <div class="khd-stat-n">{{ stats.artworks ?? '—' }}</div>
        <div class="khd-stat-k">artworks</div>
      </div>
      <div class="khd-stat">
        <div class="khd-stat-n">{{ stats.published ?? '—' }}</div>
        <div class="khd-stat-k">published</div>
      </div>
      <div class="khd-stat">
        <div class="khd-stat-n">{{ stats.admins ?? '—' }}</div>
        <div class="khd-stat-k">administrators</div>
      </div>
    </div>

    <div class="khd-cards">
      <NuxtLink v-for="c in cards" :key="c.to" :to="c.to" class="kha-card khd-card">
        <div class="khd-card-title">{{ c.title }}</div>
        <p class="khd-card-body">{{ c.body }}</p>
        <span class="khd-card-go">Open →</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.khd-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 48px;
}
.khd-stat {
  padding-left: 24px;
  border-left: 1px solid var(--hairline);
  display: flex;
  align-items: baseline;
  gap: 14px;
}
.khd-stat-n {
  font-family: var(--font-display);
  font-size: 44px;
  font-weight: 500;
  color: var(--ink);
}
.khd-stat-k {
  font-family: var(--font-ui);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-3);
  font-weight: 600;
}
.khd-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
.khd-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: box-shadow var(--dur-ui) var(--ease);
}
.khd-card:hover {
  box-shadow: var(--shadow-2);
}
.khd-card-title {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 8px;
}
.khd-card-body {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.55;
  color: var(--ink-2);
  margin: 0 0 16px;
}
.khd-card-go {
  font-family: var(--font-ui);
  font-size: 12px;
  font-weight: 600;
  color: var(--sienna);
}

@media (max-width: 640px) {
  .khd-stats {
    grid-template-columns: 1fr;
  }
}
</style>
