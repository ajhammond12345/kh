variable "project_id" {
  type    = string
  default = "ajh-kh-gallery"
}

variable "dev_project_id" {
  type    = string
  default = "ajh-kh-gallery-dev"
}

variable "auth_managed" {
  description = "Manage Identity Platform config in terraform. initializeAuth is billing-gated, so this requires billing_account to be linked to the prod project."
  type        = bool
  default     = true
}

variable "management_project" {
  description = "Quota/billing project for API calls (carries the billing account for all ajh infra)."
  type        = string
  default     = "ajh-infrastructure"
}

variable "custom_domain" {
  description = "Apex domain served by the prod hosting site; www.<domain> redirects to it."
  type        = string
  default     = "knighton-hammond.com"
}

variable "firebase_admins" {
  description = "Google accounts granted roles/firebase.admin on the prod project and a gallery admins/ doc. Lowercase emails."
  type        = set(string)
  default     = ["nicolasjhammond@gmail.com"]
}

variable "billing_account" {
  description = "Billing account linked to the prod project. Needed for Identity Platform (Auth config) and Cloud Storage uploads; dev stays on Spark."
  type        = string
  default     = "01CC13-E28451-386B15"
}

variable "google_oauth_client_id" {
  description = "OAuth client id behind Google sign-in (auto-created by the Firebase console). Empty = Google provider not managed."
  type        = string
  default     = ""
}

variable "google_oauth_client_secret" {
  type      = string
  default   = ""
  sensitive = true
}

variable "owner_email" {
  description = "Gallery owner: an admin who can also add and remove other admins. Lowercase."
  type        = string
  default     = "ajhammond123@gmail.com"
}
