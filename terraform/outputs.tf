output "aks_cluster_name" {
  value       = module.aks.cluster_name
  description = "Name of the provisioned Azure Kubernetes Service cluster"
}

output "aks_kube_config" {
  value       = module.aks.kube_config
  sensitive   = true
  description = "Kubernetes configuration to connect via kubectl"
}

output "database_endpoint" {
  value       = module.database.fqdn
  description = "PostgreSQL Flexible Server connection endpoint"
}

output "redis_hostname" {
  value       = module.redis.hostname
  description = "Azure Cache for Redis connection host"
}
