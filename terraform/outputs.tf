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
