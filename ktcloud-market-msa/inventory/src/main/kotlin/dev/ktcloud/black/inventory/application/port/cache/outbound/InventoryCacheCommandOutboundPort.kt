package dev.ktcloud.black.inventory.application.port.cache.outbound

interface InventoryCacheCommandOutboundPort {
    fun decrease(productId: String, skuCode: String, amount: Int): Int
    fun increase(productId: String, skuCode: String, amount: Int): Int
}