<script setup lang="ts">
import { fieldsFrom, type ArtworkFields, type SubmissionDoc } from '~/composables/useArtworkAdmin'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Submissions — Knighton-Hammond Admin' })

const { imageUrl } = useGallery()
const { loadSubmissions, approveSubmission, rejectSubmission } = useArtworkAdmin()

const submissions = ref<SubmissionDoc[]>([])
const loading = ref(true)
const loadError = ref('')

async function refresh() {
  try {
    submissions.value = await loadSubmissions()
  } catch {
    loadError.value = 'The submissions could not be loaded. Please try again.'
  } finally {
    loading.value = false
  }
}
onMounted(refresh)

const pending = computed(() => submissions.value.filter((s) => s.status === 'pending'))
const reviewed = computed(() => submissions.value.filter((s) => s.status !== 'pending'))

const thumb = (s: SubmissionDoc, size: 'thumb' | 'large' = 'thumb') => imageUrl(s.imageName, size, 'jpg', s.imageBase)
const originalUrl = (s: SubmissionDoc) => {
  const path = s.imagePaths.find((p) => p.includes('/original/'))
  return path ? `${s.imageBase.slice(0, s.imageBase.indexOf('/uploads/'))}/${path}` : thumb(s, 'large')
}

function formatDate(s: SubmissionDoc) {
  const date = s.createdAt?.toDate?.()
  return date ? date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
}

const reviewing = ref<SubmissionDoc | null>(null)
const form = ref<ArtworkFields>(fieldsFrom({}))
const busy = ref<'' | 'approve' | 'reject'>('')
const reviewError = ref('')

function openReview(s: SubmissionDoc) {
  reviewing.value = s
  form.value = fieldsFrom(s)
  reviewError.value = ''
}

async function approve() {
  const s = reviewing.value
  if (!s) return
  if (!form.value.title.trim()) {
    reviewError.value = 'A title is required.'
    return
  }
  busy.value = 'approve'
  reviewError.value = ''
  try {
    await approveSubmission(s, form.value)
    reviewing.value = null
    await refresh()
  } catch {
    reviewError.value = 'The submission could not be approved. Please try again.'
  } finally {
    busy.value = ''
  }
}

async function reject() {
  const s = reviewing.value
  if (!s) return
  if (!confirm(`Reject “${s.title}”? Its photos will be deleted.`)) return
  busy.value = 'reject'
  reviewError.value = ''
  try {
    await rejectSubmission(s)
    reviewing.value = null
    await refresh()
  } catch {
    reviewError.value = 'The submission could not be rejected. Please try again.'
  } finally {
    busy.value = ''
  }
}
</script>

<template>
  <div>
    <div class="kha-eyebrow">THE CATALOGUE ROOM</div>
    <h1 class="kha-title">Submissions</h1>
    <p class="kss-intro">
      Works sent in by visitors through <NuxtLink to="/submit">Add an artwork</NuxtLink>. Approving
      one publishes it to the library; you can correct the details first.
    </p>

    <p v-if="loadError" class="kha-error">{{ loadError }}</p>
    <p v-else-if="loading" class="kss-muted">Loading submissions…</p>
    <p v-else-if="!pending.length" class="kss-muted">Nothing waiting for review.</p>

    <div v-if="pending.length" class="kss-list">
      <article v-for="s in pending" :key="s.id" class="kha-card kss-item">
        <img :src="thumb(s)" :alt="s.title || ''" class="kss-thumb" loading="lazy" />
        <div class="kss-meta">
          <div class="kss-title">{{ s.title }}</div>
          <div class="kss-facts">{{ [s.date, s.medium, s.dimensions].filter(Boolean).join(' · ') || 'No details given' }}</div>
          <div class="kss-from">From {{ s.submitterName || s.submitterEmail }}<span v-if="s.submitterName"> ({{ s.submitterEmail }})</span> · {{ formatDate(s) }}</div>
        </div>
        <button class="kha-btn" @click="openReview(s)">Review</button>
      </article>
    </div>

    <template v-if="reviewed.length">
      <h2 class="kss-h2">Reviewed</h2>
      <table class="kha-table">
        <thead>
          <tr>
            <th>Title</th>
            <th class="kss-col-wide">From</th>
            <th class="kss-col-wide">Sent</th>
            <th>Outcome</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in reviewed" :key="s.id">
            <td>
              <NuxtLink v-if="s.artworkSlug" :to="`/gallery/${s.artworkSlug}`" class="kss-row-title">{{ s.title }}</NuxtLink>
              <span v-else class="kss-row-title">{{ s.title }}</span>
            </td>
            <td class="kss-col-wide">{{ s.submitterName || s.submitterEmail }}</td>
            <td class="kss-col-wide">{{ formatDate(s) }}</td>
            <td>
              <span v-if="s.status === 'approved'" class="kss-approved">Approved</span>
              <span v-else class="kha-badge">Rejected</span>
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <AdminDialog v-if="reviewing" :title="reviewing.title || 'Submission'" @close="reviewing = null">
      <div class="kss-review-head">
        <a :href="originalUrl(reviewing)" target="_blank" rel="noopener">
          <img :src="thumb(reviewing, 'large')" :alt="reviewing.title || ''" class="kss-review-img" />
        </a>
        <div class="kss-review-from">
          Sent by <strong>{{ reviewing.submitterName || reviewing.submitterEmail }}</strong>
          <span v-if="reviewing.submitterName"><br />{{ reviewing.submitterEmail }}</span>
          <br />{{ formatDate(reviewing) }}
          <br /><a :href="originalUrl(reviewing)" target="_blank" rel="noopener">Open full-size photo</a>
        </div>
      </div>
      <form @submit.prevent="approve">
        <AdminArtworkFieldsForm v-model="form" id-prefix="review" />
        <p v-if="reviewError" class="kha-error">{{ reviewError }}</p>
        <div class="kss-actions">
          <button type="button" class="kha-btn--danger" :disabled="!!busy" @click="reject">
            {{ busy === 'reject' ? 'Rejecting…' : 'Reject' }}
          </button>
          <span class="kss-spacer" />
          <button type="button" class="kha-btn kha-btn--ghost" @click="reviewing = null">Cancel</button>
          <button type="submit" class="kha-btn" :disabled="!!busy">
            {{ busy === 'approve' ? 'Publishing…' : 'Approve and publish' }}
          </button>
        </div>
      </form>
    </AdminDialog>
  </div>
</template>

<style scoped>
.kss-intro {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--ink-2);
  max-width: 62ch;
  margin: -16px 0 28px;
}
.kss-intro a,
.kss-review-from a {
  color: var(--sienna);
}
.kss-muted {
  margin-bottom: 40px;
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--ink-3);
}
.kss-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 48px;
}
.kss-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
  border-radius: 10px;
}
.kss-thumb {
  width: 64px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  background: var(--parchment);
  flex: none;
}
.kss-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.kss-title,
.kss-row-title {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 18px;
  color: var(--ink);
  text-decoration: none;
}
.kss-facts,
.kss-from {
  font-family: var(--font-ui);
  font-size: 13px;
  color: var(--ink-3);
  overflow-wrap: anywhere;
}
.kss-h2 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 500;
  margin: 0 0 12px;
}
.kss-approved {
  font-family: var(--font-ui);
  font-size: 12px;
  color: var(--sage);
  font-weight: 600;
}
.kss-review-head {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 24px;
}
.kss-review-img {
  width: 200px;
  max-width: 100%;
  border-radius: 6px;
  display: block;
  background: var(--parchment);
}
.kss-review-from {
  font-family: var(--font-ui);
  font-size: 13px;
  line-height: 1.6;
  color: var(--ink-2);
  min-width: 0;
  overflow-wrap: anywhere;
}
.kss-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
}
.kss-spacer {
  flex: 1;
}
@media (max-width: 640px) {
  .kss-col-wide {
    display: none;
  }
  .kss-item {
    flex-wrap: wrap;
  }
  .kss-review-head {
    flex-direction: column;
  }
}
</style>
