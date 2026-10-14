variable "project_name" {
  type        = string
  default     = "urjamitra"
  description = "Project identifier prefix"
}

variable "environment" {
  type        = string
  default     = "prod"
  description = "Target deployment environment (dev, staging, prod)"
}

variable "location" {
  type        = string
  default     = "centralindia"
  description = "Azure region for DPDP Act sovereign data residency"
}

# AKS Autoscaling Variables
variable "aks_min_node_count" {
  type        = number
  default     = 2
  description = "Baseline worker node count when traffic is normal"
}

variable "aks_max_node_count" {
  type        = number
  default     = 12
  description = "Maximum worker node count during peak 10,000+ user spikes"
}

variable "aks_vm_size" {
  type        = string
  default     = "Standard_D4s_v5"
  description = "VM SKU for AKS worker nodes (4 vCPUs, 16 GiB RAM)"
}

# Database Credentials
variable "db_admin_username" {
  type        = string
  default     = "urjamitra_admin"
  description = "PostgreSQL administrator login name"
}

variable "db_admin_password" {
  type        = string
  sensitive   = true
  description = "PostgreSQL administrator password"
}
