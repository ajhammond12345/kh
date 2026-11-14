import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore'
import { deleteObject, listAll, ref as storageRef, uploadBytes, type StorageReference } from 'firebase/storage'
import type { ArtworkDoc, CatalogItem } from '~/composables/useArtworks'
import type { ProcessedImage } from '~/utils/artworkImage'

export type ArtworkFields = {
  title: string
  date: string
  decade: string
  medium: string
  subject: string
  location: string
  signature: string
  dimensions: string
  description: string
}

export type UploadedImage = {
  imageBase: string
  imageName: string
  dominantColor: string
}

export type SubmissionDoc = { [K in keyof ArtworkFields]: string | null } & UploadedImage & {
  id: string
  uid: string
  submitterEmail: string
  submitterName: string | null
  status: 'pending' | 'approved' | 'rejected'
  createdAt?: Timestamp
  reviewedBy?: string
  reviewedAt?: Timestamp
  artworkSlug?: string
}

export function emptyArtworkFields(): ArtworkFields {
  return {
    title: '',
    date: '',
    decade: '',
    medium: '',
    subject: '',
    location: '',
    signature: '',
    dimensions: '',
    description: '',
  }
}

export function fieldsFrom(source: Partial<Record<keyof ArtworkFields, string | null>>): ArtworkFields {
  const fields = emptyArtworkFields()
  for (const key of Object.keys(fields) as (keyof ArtworkFields)[]) fields[key] = source[key] || ''
  return fields
}

export function cleanFields(fields: ArtworkFields) {
  const out = {} as { [K in keyof ArtworkFields]: string | null }
  for (const key of Object.keys(fields) as (keyof ArtworkFields)[]) out[key] = fields[key].trim() || null
  out.decade ??= toDecade(out.date)
  return out
}

function toCatalogItem(r: ArtworkDoc): CatalogItem {
  return {
    slug: r.slug,
    title: r.title,
    date: r.date ?? null,
    decade: r.decade ?? null,
    medium: r.medium ?? null,
    subject: r.subject ?? null,
    location: r.location ?? null,
    signature: r.signature ?? null,
    dimensions: r.dimensions ?? null,
    dominantColor: r.dominantColor ?? null,
    imageBase: r.imageBase ?? null,
    imageName: r.imageName ?? null,
  }
}

export function useArtworkAdmin() {
  const { getFirestoreDb, getUploadStorage } = useFirebase()
  const { user } = useAuth()
  const bucket = useRuntimeConfig().public.firebase.uploadBucket

  const uploadsEnabled = computed(() => !!getUploadStorage())
  const uploadsRoot = `https://storage.googleapis.com/${bucket}/uploads/`

  // Every upload lives under uploads/{id}/; anything else (the static image
  // tree, or a base pointing elsewhere) has no id here and nothing to delete.
  function uploadIdOf(imageBase: string | null | undefined) {
    const id = imageBase?.startsWith(uploadsRoot) ? imageBase.slice(uploadsRoot.length) : ''
    return /^[A-Za-z0-9-]+$/.test(id) ? id : null
  }

  function originalImageUrl(image: Pick<UploadedImage, 'imageBase' | 'imageName'>) {
    return uploadIdOf(image.imageBase) ? `${image.imageBase}/original/${image.imageName}.jpg` : null
  }

  async function loadArtworks(): Promise<ArtworkDoc[]> {
    const snap = await getDocs(collection(getFirestoreDb(), 'artworks'))
    return snap.docs
      .map((d) => ({ ...(d.data() as ArtworkDoc), slug: d.id }))
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
  }

  // The artworks collection is the source of truth; rebuilding the catalogue
  // from it keeps the doc consistent even if a previous sync was interrupted.
  async function rebuildCatalog(rows?: ArtworkDoc[]) {
    const items = (rows ?? (await loadArtworks()))
      .filter((r) => r.published)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map(toCatalogItem)
    await setDoc(doc(getFirestoreDb(), 'catalog', 'artworks'), {
      items,
      count: items.length,
      updatedAt: serverTimestamp(),
    })
  }

  async function uploadImage(uploadId: string, title: string, image: ProcessedImage): Promise<UploadedImage> {
    const storage = getUploadStorage()
    if (!storage) throw new Error('Image uploads are not available on this site.')
    const { variants, original, dominantColor } = image
    const imageName = slugify(title)
    const prefix = `uploads/${uploadId}`
    const cacheControl = 'public, max-age=31536000, immutable'
    const uploads = [
      ...variants.map((v) => ({ path: `${prefix}/${v.size}/${imageName}.${v.format}`, blob: v.blob })),
      { path: `${prefix}/original/${imageName}.jpg`, blob: original },
    ]
    await Promise.all(
      uploads.map((u) =>
        uploadBytes(storageRef(storage, u.path), u.blob, { contentType: u.blob.type, cacheControl }),
      ),
    )
    return { imageBase: `${uploadsRoot}${uploadId}`, imageName, dominantColor }
  }

  async function deleteFolder(folder: StorageReference): Promise<void> {
    const { items, prefixes } = await listAll(folder)
    await Promise.all([...items.map((item) => deleteObject(item)), ...prefixes.map(deleteFolder)])
  }

  async function deleteImages(imageBase: string | null | undefined) {
    const storage = getUploadStorage()
    const id = uploadIdOf(imageBase)
    if (storage && id) await deleteFolder(storageRef(storage, `uploads/${id}`))
  }

  async function createArtwork(fields: ArtworkFields, image: UploadedImage) {
    const rows = await loadArtworks()
    const taken = new Set(rows.map((r) => r.slug))
    const base = slugify(fields.title)
    let slug = base
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`

    const record: ArtworkDoc = {
      ...cleanFields(fields),
      title: fields.title.trim(),
      slug,
      imageBase: image.imageBase,
      imageName: image.imageName,
      dominantColor: image.dominantColor,
      published: true,
      displayOrder: Math.min(0, ...rows.map((r) => r.displayOrder ?? 0)) - 1,
    }
    await setDoc(doc(getFirestoreDb(), 'artworks', slug), {
      ...record,
      addedBy: user.value?.email ?? null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    await rebuildCatalog([record, ...rows])
    return slug
  }

  async function addArtwork(fields: ArtworkFields, file: File) {
    const image = await uploadImage(crypto.randomUUID(), fields.title, await processArtworkImage(file))
    return createArtwork(fields, image)
  }

  async function submitArtwork(fields: ArtworkFields, file: File, submitterName: string) {
    const u = user.value
    if (!u?.email) throw new Error('Please sign in first.')
    // The doc goes first: storage.rules only accept a visitor's upload into
    // the folder of their own pending submission, under its imageName.
    const processed = await processArtworkImage(file)
    const ref = doc(collection(getFirestoreDb(), 'submissions'))
    await setDoc(ref, {
      ...cleanFields(fields),
      imageBase: `${uploadsRoot}${ref.id}`,
      imageName: slugify(fields.title),
      dominantColor: processed.dominantColor,
      uid: u.uid,
      submitterEmail: u.email.toLowerCase(),
      submitterName: submitterName.trim() || null,
      status: 'pending',
      createdAt: serverTimestamp(),
    })
    try {
      await uploadImage(ref.id, fields.title, processed)
    } catch (err) {
      await deleteDoc(ref).catch(() => {})
      throw err
    }
  }

  async function loadSubmissions(): Promise<SubmissionDoc[]> {
    const snap = await getDocs(collection(getFirestoreDb(), 'submissions'))
    return snap.docs
      .map((d) => ({ ...(d.data() as SubmissionDoc), id: d.id }))
      .sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0))
  }

  async function approveSubmission(sub: SubmissionDoc, fields: ArtworkFields) {
    const slug = await createArtwork(fields, sub)
    await updateDoc(doc(getFirestoreDb(), 'submissions', sub.id), {
      status: 'approved',
      artworkSlug: slug,
      reviewedBy: user.value?.email ?? null,
      reviewedAt: serverTimestamp(),
    })
    return slug
  }

  async function rejectSubmission(sub: SubmissionDoc) {
    await deleteImages(sub.imageBase)
    await updateDoc(doc(getFirestoreDb(), 'submissions', sub.id), {
      status: 'rejected',
      reviewedBy: user.value?.email ?? null,
      reviewedAt: serverTimestamp(),
    })
  }

  async function deleteArtwork(row: ArtworkDoc, remaining: ArtworkDoc[]) {
    await deleteDoc(doc(getFirestoreDb(), 'artworks', row.slug))
    await rebuildCatalog(remaining)
    await deleteImages(row.imageBase)
  }

  async function countPendingSubmissions(): Promise<number> {
    return (await loadSubmissions()).filter((s) => s.status === 'pending').length
  }

  return {
    uploadsEnabled,
    originalImageUrl,
    loadArtworks,
    rebuildCatalog,
    addArtwork,
    deleteArtwork,
    submitArtwork,
    loadSubmissions,
    approveSubmission,
    rejectSubmission,
    countPendingSubmissions,
  }
}

