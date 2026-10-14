resource "azurerm_postgresql_flexible_server" "db" {
  name                   = "urjamitra-${var.environment}-pg"
  resource_group_name    = var.resource_group_name
  location               = var.location
  version                = "16"
  delegated_subnet_id    = var.subnet_id
  administrator_login    = var.admin_username
  administrator_password = var.admin_password
  storage_mb             = 65536
  sku_name               = "GP_Standard_D4s_v3"
}

output "fqdn" {
  value = azurerm_postgresql_flexible_server.db.fqdn
}
