output "hosting_url" {
  value = "https://${google_firebase_hosting_site.default.site_id}.web.app"
}

output "web_app_config" {
  description = "Firebase web SDK config for the frontend"
  value = {
    apiKey            = data.google_firebase_web_app_config.gallery.api_key
    authDomain        = data.google_firebase_web_app_config.gallery.auth_domain
    projectId         = var.project_id
    appId             = google_firebase_web_app.gallery.app_id
    messagingSenderId = data.google_firebase_web_app_config.gallery.messaging_sender_id
  }
}

output "hosting_url_dev" {
  value = "https://${google_firebase_hosting_site.dev.site_id}.web.app"
}

output "web_app_config_dev" {
  description = "Firebase web SDK config for the dev frontend (deploy.sh dev exports these as NUXT_PUBLIC_FIREBASE_*)"
  value = {
    apiKey            = data.google_firebase_web_app_config.gallery_dev.api_key
    authDomain        = data.google_firebase_web_app_config.gallery_dev.auth_domain
    projectId         = var.dev_project_id
    appId             = google_firebase_web_app.gallery_dev.app_id
    messagingSenderId = data.google_firebase_web_app_config.gallery_dev.messaging_sender_id
  }
}
