terraform {
  required_version = ">= 1.8"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 6.0"
    }
  }

  backend "gcs" {
    bucket = "kh-infra"
    prefix = "kh"
  }
}

# ajh-infrastructure is the management project: it carries the billing
# account and is the quota project for all API calls. The site projects are
# also billed (Identity Platform config and Cloud Storage uploads need billing
# on the project itself).
provider "google" {
  project               = var.project_id
  user_project_override = true
  billing_project       = var.management_project
}

provider "google-beta" {
  project               = var.project_id
  user_project_override = true
  billing_project       = var.management_project
}

resource "google_project" "kh_gallery" {
  project_id      = var.project_id
  name            = "KH Gallery"
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

  project = google_project.kh_gallery.project_id
  service = each.value

  disable_on_destroy = false
}

resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.kh_gallery.project_id

  depends_on = [google_project_service.services]
}

resource "google_firebase_hosting_site" "default" {
  provider = google-beta
  project  = google_project.kh_gallery.project_id
  site_id  = var.project_id

  depends_on = [google_firebase_project.default]
}

resource "google_firebase_web_app" "gallery" {
  provider     = google-beta
  project      = google_project.kh_gallery.project_id
  display_name = "KH Gallery"

  depends_on = [google_firebase_project.default]
}

data "google_firebase_web_app_config" "gallery" {
  provider   = google-beta
  project    = google_project.kh_gallery.project_id
  web_app_id = google_firebase_web_app.gallery.app_id
}

resource "google_firestore_database" "default" {
  project     = google_project.kh_gallery.project_id
  name        = "(default)"
  location_id = "nam5"
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.services]
}

# initializeAuth (what this resource calls on create) is billing-gated even
# though Firebase Auth itself is free, hence billing_account on the prod
# project. Google sign-in is NOT declared here: its OAuth client can only be
# auto-created by the Firebase console (Authentication → Sign-in method →
# Google → Enable), and there is no API for that step.
resource "google_identity_platform_config" "auth" {
  count   = var.auth_managed ? 1 : 0
  project = google_project.kh_gallery.project_id

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

  authorized_domains = [
    "localhost",
    "${var.project_id}.web.app",
    "${var.project_id}.firebaseapp.com",
    var.custom_domain,
    "www.${var.custom_domain}",
  ]

  depends_on = [google_project_service.services, google_firebase_project.default]
}

# Google sign-in. Firebase's OAuth client for it can only be minted by the
# Firebase console (Authentication → Sign-in method → Google → Enable); there
# is no API for that step. Afterwards copy the client id/secret into
# terraform.tfvars (gitignored) and adopt the provider config:
#   terraform import 'google_identity_platform_default_supported_idp_config.google[0]' \
#     projects/ajh-kh-gallery/defaultSupportedIdpConfigs/google.com
resource "google_identity_platform_default_supported_idp_config" "google" {
  count   = var.google_oauth_client_id != "" ? 1 : 0
  project = google_project.kh_gallery.project_id
  idp_id  = "google.com"
  enabled = true

  client_id     = var.google_oauth_client_id
  client_secret = var.google_oauth_client_secret

  depends_on = [google_identity_platform_config.auth]
}

# Pre-seeded owner. firestore.rules looks this document up by lowercased email
# (isAdmin = doc exists, isOwner = role "owner"); only owners can add or remove
# other admins, so the first owner has to come from here.
resource "google_firestore_document" "seed_admin" {
  project     = google_project.kh_gallery.project_id
  database    = google_firestore_database.default.name
  collection  = "admins"
  document_id = var.owner_email
  fields = jsonencode({
    addedBy = { stringValue = "terraform" }
    role    = { stringValue = "owner" }
  })
}

# Artwork image uploads (admin adds + public submissions). Objects are public:
# the site builds image URLs as https://storage.googleapis.com/<bucket>/uploads/<id>/<size>/<slug>.<ext>,
# same shape as the static /images tree, so pages need no Firebase SDK call to
# render them. Writes are gated by storage.rules via the Firebase link below.
resource "google_storage_bucket" "uploads" {
  project  = google_project.kh_gallery.project_id
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
  project = google_project.kh_gallery.project_id
  role    = "roles/firebaserules.firestoreServiceAgent"
  member  = "serviceAccount:service-${google_project.kh_gallery.number}@gcp-sa-firebasestorage.iam.gserviceaccount.com"
}

resource "google_firebase_storage_bucket" "uploads" {
  provider  = google-beta
  project   = google_project.kh_gallery.project_id
  bucket_id = google_storage_bucket.uploads.name

  depends_on = [google_firebase_project.default]
}

# --- dev environment (mirrors prod; Auth needs the same one-time console
# enable on the dev project until billing unlocks auth_managed) ---

resource "google_project" "kh_gallery_dev" {
  project_id      = var.dev_project_id
  name            = "KH Gallery Dev"
  billing_account = var.billing_account
  deletion_policy = "PREVENT"
}

resource "google_project_service" "services_dev" {
  for_each = toset([
    "firebase.googleapis.com",
    "firebasehosting.googleapis.com",
    "firestore.googleapis.com",
    "identitytoolkit.googleapis.com",
    "firebaserules.googleapis.com",
    "firebasestorage.googleapis.com",
    "serviceusage.googleapis.com",
    "cloudresourcemanager.googleapis.com",
  ])

  project = google_project.kh_gallery_dev.project_id
  service = each.value

  disable_on_destroy = false
}

resource "google_firebase_project" "dev" {
  provider = google-beta
  project  = google_project.kh_gallery_dev.project_id

  depends_on = [google_project_service.services_dev]
}

resource "google_firebase_hosting_site" "dev" {
  provider = google-beta
  project  = google_project.kh_gallery_dev.project_id
  site_id  = var.dev_project_id

  depends_on = [google_firebase_project.dev]
}

resource "google_firebase_web_app" "gallery_dev" {
  provider     = google-beta
  project      = google_project.kh_gallery_dev.project_id
  display_name = "KH Gallery Dev"

  depends_on = [google_firebase_project.dev]
}

data "google_firebase_web_app_config" "gallery_dev" {
  provider   = google-beta
  project    = google_project.kh_gallery_dev.project_id
  web_app_id = google_firebase_web_app.gallery_dev.app_id
}

resource "google_firestore_database" "dev" {
  project     = google_project.kh_gallery_dev.project_id
  name        = "(default)"
  location_id = "nam5"
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.services_dev]
}

resource "google_firestore_document" "seed_admin_dev" {
  project     = google_project.kh_gallery_dev.project_id
  database    = google_firestore_database.dev.name
  collection  = "admins"
  document_id = var.owner_email
  fields = jsonencode({
    addedBy = { stringValue = "terraform" }
    role    = { stringValue = "owner" }
  })
}

# --- custom domain (prod only) ---
# wait_dns_verification stays false so apply doesn't block on the registrar;
# the records to set are in the `custom_domain_dns` output.

resource "google_firebase_hosting_custom_domain" "apex" {
  provider = google-beta
  project  = google_project.kh_gallery.project_id
  site_id  = google_firebase_hosting_site.default.site_id

  custom_domain         = var.custom_domain
  wait_dns_verification = false
}

resource "google_firebase_hosting_custom_domain" "www" {
  provider = google-beta
  project  = google_project.kh_gallery.project_id
  site_id  = google_firebase_hosting_site.default.site_id

  custom_domain         = "www.${var.custom_domain}"
  redirect_target       = var.custom_domain
  wait_dns_verification = false
}

# --- project access ---
# Owners (project creator + terraform SA) are managed outside terraform.

resource "google_project_iam_member" "firebase_admins" {
  for_each = var.firebase_admins

  project = google_project.kh_gallery.project_id
  role    = "roles/firebase.admin"
  member  = "user:${each.value}"
}

# The same people get the gallery admin UI (firestore.rules isAdmin()).
resource "google_firestore_document" "admins" {
  for_each = var.firebase_admins

  project     = google_project.kh_gallery.project_id
  database    = google_firestore_database.default.name
  collection  = "admins"
  document_id = each.value
  fields = jsonencode({
    addedBy = { stringValue = "terraform" }
    role    = { stringValue = "admin" }
  })
}
