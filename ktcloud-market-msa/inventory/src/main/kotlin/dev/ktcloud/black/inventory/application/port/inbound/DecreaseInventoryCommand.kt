package dev.ktcloud.black.inventory.application.port.inbound

interface DecreaseInventoryCommand {
    fun decrease(command: In)

    data class In(
        val productId: String,
        val skuCode: String,
        val amount: Int
    )
}