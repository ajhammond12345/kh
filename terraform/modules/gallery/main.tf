resource "google_project" "this" {
  project_id      = var.project_id
  name            = var.display_name
  billing_account = var.billing_account
  deletion_policy = "PREVENT"
}

resource "google_project_service" "services" {
  for_each = toset([
    "firebase.googleapis.com",
    "firebasehosting.googleapis.com",
    "firestore.googleapis.com",
    "identitytoolkit.googleapis.com",
    "firebaserules.googleapis.com",
    "firebasestorage.googleapis.com",
    "serviceusage.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "storage.googleapis.com",
  ])

  project = google_project.this.project_id
  service = each.value

  disable_on_destroy = false
}

resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.this.project_id

  depends_on = [google_project_service.services]
}

resource "google_firebase_hosting_site" "default" {
  provider = google-beta
  project  = google_project.this.project_id
  site_id  = var.project_id

  depends_on = [google_firebase_project.default]
}

resource "google_firebase_web_app" "gallery" {
  provider     = google-beta
  project      = google_project.this.project_id
  display_name = var.display_name

  depends_on = [google_firebase_project.default]
}

data "google_firebase_web_app_config" "gallery" {
  provider   = google-beta
  project    = google_project.this.project_id
  web_app_id = google_firebase_web_app.gallery.app_id
}

resource "google_firestore_database" "default" {
  project     = google_project.this.project_id
  name        = "(default)"
  location_id = "nam5"
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.services]
}

# initializeAuth (what this resource calls on create) is billing-gated even
# though Firebase Auth itself is free.
resource "google_identity_platform_config" "auth" {
  project = google_project.this.project_id

  sign_in {
    email {
      enabled           = true
      password_required = false # email-link sign-in
    }
    # Provider reads these back from the API even when unset; declaring the
    # defaults keeps the plan clean.
    phone_number {
      enabled            = false
      test_phone_numbers = {}
    }
  }

  multi_tenant {
    allow_tenants = false
  }

  authorized_domains = concat([
    "localhost",
    "${var.project_id}.web.app",
    "${var.project_id}.firebaseapp.com",
  ], var.extra_authorized_domains)

  depends_on = [google_project_service.services, google_firebase_project.default]
}

# Google sign-in. Its OAuth client can only be minted by the Firebase console
# (Authentication → Sign-in method → Google → Enable); there is no API for
# that step. The README has the recipe for adopting it here afterwards.
resource "google_identity_platform_default_supported_idp_config" "google" {
  count   = var.google_oauth_client_id != "" ? 1 : 0
  project = google_project.this.project_id
  idp_id  = "google.com"
  enabled = true

  client_id     = var.google_oauth_client_id
  client_secret = var.google_oauth_client_secret

  depends_on = [google_identity_platform_config.auth]
}

# firestore.rules looks admins up by lowercased email (isAdmin = doc exists,
# isOwner = role "owner"); only owners can add or remove other admins, so the
# first owner has to come from here.
resource "google_firestore_document" "seed_admin" {
  project     = google_project.this.project_id
  database    = google_firestore_database.default.name
  collection  = "admins"
  document_id = var.owner_email
  fields = jsonencode({
    addedBy = { stringValue = "terraform" }
    role    = { stringValue = "owner" }
  })
}

# Owners (project creator + terraform SA) are managed outside terraform.
resource "google_project_iam_member" "firebase_admins" {
  for_each = var.firebase_admins

  project = google_project.this.project_id
  role    = "roles/firebase.admin"
  member  = "user:${each.value}"
}

resource "google_firestore_document" "admins" {
  for_each = var.firebase_admins

  project     = google_project.this.project_id
  database    = google_firestore_database.default.name
  collection  = "admins"
  document_id = each.value
  fields = jsonencode({
    addedBy = { stringValue = "terraform" }
    role    = { stringValue = "admin" }
  })
}

# Artwork image uploads (admin adds + public submissions). Objects are public:
# the site builds image URLs as https://storage.googleapis.com/<bucket>/uploads/<id>/<size>/<slug>.<ext>,
# same shape as the static /images tree, so pages need no Firebase SDK call to
# render them. Writes are gated by storage.rules via the Firebase link below.
resource "google_storage_bucket" "uploads" {
  project  = google_project.this.project_id
  name     = "${var.project_id}-uploads"
  location = "US-EAST1"

  uniform_bucket_level_access = true
  public_access_prevention    = "inherited"
  force_destroy               = false

  depends_on = [google_project_service.services]
}

resource "google_storage_bucket_iam_member" "uploads_public_read" {
  bucket = google_storage_bucket.uploads.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# storage.rules checks admins/ in Firestore; cross-service rules run as the
# Storage service agent, which needs this role (the CLI only grants it when
# deploying interactively).
resource "google_project_iam_member" "storage_rules_firestore" {
  project = google_project.this.project_id
  role    = "roles/firebaserules.firestoreServiceAgent"
  member  = "serviceAccount:service-${google_project.this.number}@gcp-sa-firebasestorage.iam.gserviceaccount.com"
}

resource "google_firebase_storage_bucket" "uploads" {
  provider  = google-beta
  project   = google_project.this.project_id
  bucket_id = google_storage_bucket.uploads.name

  depends_on = [google_firebase_project.default]
}
