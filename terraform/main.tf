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

# ajh-infrastructure is the management project: it carries the (future)
# billing account and is the quota project for all API calls; site projects
# stay unbilled on the Spark plan. Note: runtime image uploads (Cloud Storage
# for Firebase) and terraform-managed Auth config are the two features that
# would additionally need billing on THIS project — revisit if either becomes
# a priority.
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
# though Firebase Auth itself is free on Spark — until a billing account is
# linked, Auth must be enabled once in the Firebase console instead:
#   Authentication → Get started → enable "Email link" and "Google".
# After billing: set auth_managed=true and `terraform import
# google_identity_platform_config.auth[0] projects/ajh-kh-gallery/config`.
resource "google_identity_platform_config" "auth" {
  count   = var.auth_managed ? 1 : 0
  project = google_project.kh_gallery.project_id

  sign_in {
    email {
      enabled           = true
      password_required = false # email-link sign-in
    }
  }

  authorized_domains = [
    "localhost",
    "${var.project_id}.web.app",
    "${var.project_id}.firebaseapp.com",
  ]

  depends_on = [google_project_service.services, google_firebase_project.default]
}

# Pre-seeded admin. The firestore.rules isAdmin() check looks this document up
# by lowercased email, so the admin can sign in with Google or an email link
# before any admin has ever written to the admins collection.
resource "google_firestore_document" "seed_admin" {
  project     = google_project.kh_gallery.project_id
  database    = google_firestore_database.default.name
  collection  = "admins"
  document_id = "ajhammond123@gmail.com"
  fields      = jsonencode({ addedBy = { stringValue = "terraform" } })
}
