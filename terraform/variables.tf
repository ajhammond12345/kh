variable "project_id" {
  type    = string
  default = "ajh-kh-gallery"
}

variable "dev_project_id" {
  type    = string
  default = "ajh-kh-gallery-dev"
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
  description = "Google accounts granted roles/firebase.admin and a gallery admins/ doc on prod and dev. Lowercase emails."
  type        = set(string)
  default     = ["nicolasjhammond@gmail.com"]
}

variable "billing_account" {
  description = "Billing account linked to the prod and dev projects."
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

variable "dev_google_oauth_client_id" {
  description = "Same as google_oauth_client_id, for the dev project's own console-created client."
  type        = string
  default     = ""
}

variable "dev_google_oauth_client_secret" {
  type      = string
  default   = ""
  sensitive = true
}
