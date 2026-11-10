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
# account and is the quota project for all API calls.
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

# Prod and dev come from the same module so dev never lags prod.
module "prod" {
  source = "./modules/gallery"

  project_id                 = var.project_id
  display_name               = "KH Gallery"
  billing_account            = var.billing_account
  owner_email                = var.owner_email
  firebase_admins            = var.firebase_admins
  extra_authorized_domains   = [var.custom_domain, "www.${var.custom_domain}"]
  google_oauth_client_id     = var.google_oauth_client_id
  google_oauth_client_secret = var.google_oauth_client_secret
}

module "dev" {
  source = "./modules/gallery"

  project_id                 = var.dev_project_id
  display_name               = "KH Gallery Dev"
  billing_account            = var.billing_account
  owner_email                = var.owner_email
  firebase_admins            = var.firebase_admins
  google_oauth_client_id     = var.dev_google_oauth_client_id
  google_oauth_client_secret = var.dev_google_oauth_client_secret
}

# --- custom domain (prod only) ---
# wait_dns_verification stays false so apply doesn't block on the registrar;
# the records to set are in the `custom_domain_dns` output.

resource "google_firebase_hosting_custom_domain" "apex" {
  provider = google-beta
  project  = var.project_id
  site_id  = module.prod.hosting_site_id

  custom_domain         = var.custom_domain
  wait_dns_verification = false
}

resource "google_firebase_hosting_custom_domain" "www" {
  provider = google-beta
  project  = var.project_id
  site_id  = module.prod.hosting_site_id

  custom_domain         = "www.${var.custom_domain}"
  redirect_target       = var.custom_domain
  wait_dns_verification = false
}
