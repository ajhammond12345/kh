# TEMPORARY — local state until the kh-infra bucket exists (billing-gated).
# See ajh-infrastructure/README.md. Once the bucket is created:
#   rm backend_override.tf && terraform init -migrate-state -force-copy
terraform {
  backend "local" {}
}
