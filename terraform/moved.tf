# State moves from before prod and dev shared modules/gallery. Safe to delete
# once every state that predates the module has been applied.

moved {
  from = google_project.kh_gallery
  to   = module.prod.google_project.this
}

moved {
  from = google_project_service.services
  to   = module.prod.google_project_service.services
}

moved {
  from = google_firebase_project.default
  to   = module.prod.google_firebase_project.default
}

moved {
  from = google_firebase_hosting_site.default
  to   = module.prod.google_firebase_hosting_site.default
}

moved {
  from = google_firebase_web_app.gallery
  to   = module.prod.google_firebase_web_app.gallery
}

moved {
  from = google_firestore_database.default
  to   = module.prod.google_firestore_database.default
}

moved {
  from = google_identity_platform_config.auth[0]
  to   = module.prod.google_identity_platform_config.auth
}

moved {
  from = google_identity_platform_default_supported_idp_config.google
  to   = module.prod.google_identity_platform_default_supported_idp_config.google
}

moved {
  from = google_firestore_document.seed_admin
  to   = module.prod.google_firestore_document.seed_admin
}

moved {
  from = google_project_iam_member.firebase_admins
  to   = module.prod.google_project_iam_member.firebase_admins
}

moved {
  from = google_firestore_document.admins
  to   = module.prod.google_firestore_document.admins
}

moved {
  from = google_storage_bucket.uploads
  to   = module.prod.google_storage_bucket.uploads
}

moved {
  from = google_storage_bucket_iam_member.uploads_public_read
  to   = module.prod.google_storage_bucket_iam_member.uploads_public_read
}

moved {
  from = google_project_iam_member.storage_rules_firestore
  to   = module.prod.google_project_iam_member.storage_rules_firestore
}

moved {
  from = google_firebase_storage_bucket.uploads
  to   = module.prod.google_firebase_storage_bucket.uploads
}

moved {
  from = google_project.kh_gallery_dev
  to   = module.dev.google_project.this
}

moved {
  from = google_project_service.services_dev
  to   = module.dev.google_project_service.services
}

moved {
  from = google_firebase_project.dev
  to   = module.dev.google_firebase_project.default
}

moved {
  from = google_firebase_hosting_site.dev
  to   = module.dev.google_firebase_hosting_site.default
}

moved {
  from = google_firebase_web_app.gallery_dev
  to   = module.dev.google_firebase_web_app.gallery
}

moved {
  from = google_firestore_database.dev
  to   = module.dev.google_firestore_database.default
}

moved {
  from = google_firestore_document.seed_admin_dev
  to   = module.dev.google_firestore_document.seed_admin
}
