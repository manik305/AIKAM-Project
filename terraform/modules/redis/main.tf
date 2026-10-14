resource "azurerm_redis_cache" "redis" {
  name                = "urjamitra-${var.environment}-redis"
  location            = var.location
  resource_group_name = var.resource_group_name
  capacity            = 2
  family              = "C"
  sku_name            = "Standard"
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"
}

output "hostname" {
  value = azurerm_redis_cache.redis.hostname
}
