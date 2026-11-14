output "hosting_url" {
  value = "https://${module.prod.hosting_site_id}.web.app"
}

output "web_app_config" {
  description = "Firebase web SDK config for the frontend"
  value       = module.prod.web_app_config
}

output "hosting_url_dev" {
  value = "https://${module.dev.hosting_site_id}.web.app"
}

output "web_app_config_dev" {
  description = "Firebase web SDK config for the dev frontend (deploy.sh dev exports these as NUXT_PUBLIC_FIREBASE_*)"
  value       = module.dev.web_app_config
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
