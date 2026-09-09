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

output "custom_domain_url" {
  value = "https://${google_firebase_hosting_custom_domain.apex.custom_domain}"
}

# Registrar changes still outstanding, per hostname (ADD = create, REMOVE = delete).
# Empty once Firebase sees the records it wants.
output "custom_domain_dns" {
  value = {
    for d in [google_firebase_hosting_custom_domain.apex, google_firebase_hosting_custom_domain.www] :
    d.custom_domain => flatten([
      for u in d.required_dns_updates : [
        for host in concat(u.discovered, u.desired) : [
          for r in host.records : "${r.required_action} ${r.type} ${r.domain_name} -> ${r.rdata}"
          if r.required_action != ""
        ]
      ]
    ])
  }
}

output "custom_domain_status" {
  value = {
    for d in [google_firebase_hosting_custom_domain.apex, google_firebase_hosting_custom_domain.www] :
    d.custom_domain => "${d.host_state} / ${d.ownership_state}"
  }
}
