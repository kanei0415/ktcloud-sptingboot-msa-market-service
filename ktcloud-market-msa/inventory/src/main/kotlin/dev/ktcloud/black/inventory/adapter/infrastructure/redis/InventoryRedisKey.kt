package dev.ktcloud.black.inventory.adapter.infrastructure.redis

data class InventoryRedisKey(
    val productId: String,
    val skuCode: String
) {
    fun toRedisKey() = "$productId:$skuCode"

    override fun toString(): String = toRedisKey()
}
