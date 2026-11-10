<script setup lang="ts">
import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, type Timestamp } from 'firebase/firestore'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Users — Knighton-Hammond Admin' })

const { getFirestoreDb } = useFirebase()
const { user, isOwner } = useAuth()

type Role = 'owner' | 'admin'
type AdminRow = { email: string; role?: Role; addedBy?: string; addedAt?: Timestamp }

const admins = ref<AdminRow[]>([])
const loading = ref(true)
const error = ref('')
const newEmail = ref('')
const newRole = ref<Role>('admin')
const adding = ref(false)

onMounted(async () => {
  try {
    const snap = await getDocs(collection(getFirestoreDb(), 'admins'))
    admins.value = snap.docs
      .map((d) => ({ email: d.id, ...d.data() }))
      .sort((a, b) => a.email.localeCompare(b.email))
  } catch {
    error.value = 'The administrators could not be loaded. Please try again.'
  } finally {
    loading.value = false
  }
})

function formatDate(ts?: Timestamp) {
  const date = ts?.toDate?.()
  if (!date) return '—'
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
}

async function addAdmin() {
  error.value = ''
  const email = newEmail.value.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error.value = 'Please enter a valid email address.'
    return
  }
  if (admins.value.some((a) => a.email === email)) {
    error.value = `${email} is already an administrator.`
    return
  }
  adding.value = true
  try {
    await setDoc(doc(getFirestoreDb(), 'admins', email), {
      role: newRole.value,
      addedBy: user.value?.email || null,
      addedAt: serverTimestamp(),
    })
    admins.value = [...admins.value, { email, role: newRole.value, addedBy: user.value?.email || undefined }]
      .sort((a, b) => a.email.localeCompare(b.email))
    newEmail.value = ''
    newRole.value = 'admin'
  } catch {
    error.value = 'The administrator could not be added. Please try again.'
  } finally {
    adding.value = false
  }
}

async function removeAdmin(row: AdminRow) {
  error.value = ''
  if (row.email === user.value?.email?.toLowerCase()) {
    error.value = 'You cannot remove your own access.'
    return
  }
  if (!confirm(`Remove ${row.email} as an administrator?`)) return
  try {
    await deleteDoc(doc(getFirestoreDb(), 'admins', row.email))
    admins.value = admins.value.filter((a) => a.email !== row.email)
  } catch {
    error.value = 'The administrator could not be removed. Please try again.'
  }
}
</script>

<template>
  <div>
    <div class="kha-eyebrow">THE CATALOGUE ROOM</div>
    <h1 class="kha-title">Users</h1>

    <p v-if="!isOwner" class="khu-note">
      Only the site owner can add or remove administrators.
    </p>
    <div v-else class="kha-card khu-add">
      <div class="khu-add-field">
        <label class="kha-label" for="new-admin">Add an administrator</label>
        <input
          id="new-admin"
          v-model="newEmail"
          type="email"
          class="kha-input"
          placeholder="colleague@example.org"
          @keydown.enter.prevent="addAdmin"
        />
      </div>
      <div>
        <label class="kha-label" for="new-admin-role">Role</label>
        <select id="new-admin-role" v-model="newRole" class="kha-select khu-role-select">
          <option value="admin">Administrator</option>
          <option value="owner">Owner (can manage administrators)</option>
        </select>
      </div>
      <button class="kha-btn khu-add-btn" :disabled="adding" @click="addAdmin">
        {{ adding ? 'Adding…' : 'Add' }}
      </button>
    </div>

    <p v-if="error" class="kha-error khu-error">{{ error }}</p>
    <p v-if="loading" class="khu-muted">Loading administrators…</p>

    <table v-if="admins.length" class="kha-table">
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th class="khu-col-wide">Added by</th>
          <th class="khu-col-wide">Added</th>
          <th v-if="isOwner" :style="{ textAlign: 'right' }">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in admins" :key="a.email">
          <td>
            {{ a.email }}
            <span v-if="a.email === user?.email?.toLowerCase()" class="khu-you">you</span>
          </td>
          <td>{{ a.role === 'owner' ? 'Owner' : 'Administrator' }}</td>
          <td class="khu-col-wide">{{ a.addedBy || '—' }}</td>
          <td class="khu-col-wide">{{ formatDate(a.addedAt) }}</td>
          <td v-if="isOwner" :style="{ textAlign: 'right' }">
            <button
              v-if="a.email !== user?.email?.toLowerCase()"
              class="kha-btn--danger khu-remove"
              @click="removeAdmin(a)"
            >
              Remove
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.khu-add {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 32px;
}
.khu-add-field {
  flex: 1;
  max-width: 380px;
}
.khu-role-select {
  min-width: 200px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7180' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}
.khu-add-btn {
  min-height: 44px;
}
.khu-note {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--ink-3);
  margin: -12px 0 28px;
}
.khu-error {
  margin-bottom: 16px;
}
.khu-muted {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--ink-3);
}
.khu-you {
  font-family: var(--font-ui);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-3);
  border: 1px solid var(--hairline);
  border-radius: 2px;
  padding: 2px 6px;
  margin-left: 8px;
}
.khu-remove {
  cursor: pointer;
  font-family: var(--font-ui);
}

@media (max-width: 640px) {
  .khu-col-wide {
    display: none;
  }
  .khu-add {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
