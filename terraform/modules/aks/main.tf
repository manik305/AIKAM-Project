# AKS Cluster with Autoscaler Enabled (Elastic scaling: min_node_count -> max_node_count)

resource "azurerm_kubernetes_cluster" "aks" {
  name                = "urjamitra-${var.environment}-aks"
  location            = var.location
  resource_group_name = var.resource_group_name
  dns_prefix          = "urjamitra-${var.environment}"

  # Fixed System Node Pool for Kubernetes core daemons
  default_node_pool {
    name       = "systempool"
    node_count = 2
    vm_size    = "Standard_D2s_v5"
    vnet_subnet_id = var.subnet_id
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
  }
}

# Dynamic User Node Pool with Autoscaling for App & Agents
resource "azurerm_kubernetes_cluster_node_pool" "user_pool" {
  name                  = "userapps"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.aks.id
  vm_size               = var.vm_size
  vnet_subnet_id        = var.subnet_id

  # ELASTIC AUTOSCALING CONFIGURATION:
  enable_auto_scaling   = true
  min_count             = var.min_node_count  # Baseline (e.g. 2 nodes)
  max_count             = var.max_node_count  # Spike load (e.g. 12 nodes)
  os_disk_size_gb       = 128

  node_labels = {
    role = "application-workload"
  }
}

output "cluster_name" {
  value = azurerm_kubernetes_cluster.aks.name
}

output "kube_config" {
  value = azurerm_kubernetes_cluster.aks.kube_config_raw
}
