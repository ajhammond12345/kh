variable "project_id" {
  type = string
}

variable "display_name" {
  description = "Used for the GCP project and the Firebase web app."
  type        = string
}

variable "billing_account" {
  description = "Identity Platform (Auth config) and Cloud Storage uploads need billing on the project itself."
  type        = string
}

variable "owner_email" {
  description = "Gallery owner: an admin who can also add and remove other admins. Lowercase."
  type        = string
}

variable "firebase_admins" {
  description = "Google accounts granted roles/firebase.admin and a gallery admins/ doc. Lowercase emails."
  type        = set(string)
}

variable "extra_authorized_domains" {
  description = "Auth authorized domains beyond localhost and the Firebase defaults (custom domains)."
  type        = list(string)
  default     = []
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
