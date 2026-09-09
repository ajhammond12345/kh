variable "project_id" {
  type    = string
  default = "ajh-kh-gallery"
}

variable "dev_project_id" {
  type    = string
  default = "ajh-kh-gallery-dev"
}

variable "auth_managed" {
  description = "Manage Identity Platform config in terraform. Requires billing (initializeAuth is billing-gated); until then enable Auth providers in the Firebase console."
  type        = bool
  default     = false
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
