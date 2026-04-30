package dev.ktcloud.black.inventory.application.port.inbound

interface CreateInventoryCommand {
    fun create(command: In)

    data class In(
        val productId: String,
        val skuCode: String,
    )
}