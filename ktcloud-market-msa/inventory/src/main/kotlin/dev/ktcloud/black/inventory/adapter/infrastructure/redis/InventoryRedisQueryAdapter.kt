package dev.ktcloud.black.inventory.adapter.infrastructure.redis

import dev.ktcloud.black.inventory.application.port.cache.outbound.InventoryCacheQueryOutboundPort
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Component

@Component
class InventoryRedisQueryAdapter(
    private val redisTemplate: RedisTemplate<String, Int>
): InventoryCacheQueryOutboundPort {
    override fun fetchInventory(productId: String, skuCode: String): Int? {
        val key = InventoryRedisKey(productId, skuCode).toRedisKey()
        return redisTemplate.opsForValue().get(key)
    }
}