# Terraform Root Orchestration for UrjaMitra AI Infrastructure
# Cloud Target: Microsoft Azure (Central India / South India for data residency)

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "${var.project_name}-${var.environment}-rg"
  location = var.location
  tags = {
    Project     = "UrjaMitra-AI"
    Environment = var.environment
    ManagedBy   = "Terraform"
    Challenge   = "AIKAM-EnergyTech"
  }
}

# 1. Networking Module (VNet, Subnets, NSGs)
module "networking" {
  source              = "./modules/networking"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  environment         = var.environment
}

# 2. Azure Kubernetes Service (AKS) Module with Autoscaling
module "aks" {
  source              = "./modules/aks"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  environment         = var.environment
  subnet_id           = module.networking.aks_subnet_id
  min_node_count      = var.aks_min_node_count
  max_node_count      = var.aks_max_node_count
  vm_size             = var.aks_vm_size
}

# 3. Azure Managed PostgreSQL Flexible Server Module
module "database" {
  source              = "./modules/database"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  environment         = var.environment
  subnet_id           = module.networking.db_subnet_id
  admin_username      = var.db_admin_username
  admin_password      = var.db_admin_password
}

# 4. Azure Cache for Redis Module
module "redis" {
  source              = "./modules/redis"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  environment         = var.environment
  subnet_id           = module.networking.redis_subnet_id
}
