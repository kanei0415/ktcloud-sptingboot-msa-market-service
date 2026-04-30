package dev.ktcloud.black.inventory.adapter.infrastructure.redis

import dev.ktcloud.black.inventory.application.port.cache.outbound.InventoryCacheCommandOutboundPort
import dev.ktcloud.black.inventory.configuration.redis.RedisConfig
import dev.ktcloud.black.inventory.domain.exception.InventoryException
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.core.script.RedisScript
import org.springframework.stereotype.Component

@Component
class InventoryRedisCommandAdapter(
    private val redisTemplate: RedisTemplate<String, Long>,
    private val decreaseInventoryScript: RedisScript<Long>
): InventoryCacheCommandOutboundPort {
    override fun decrease(productId: String, skuCode: String, amount: Int): Int {
        val redisKey = InventoryRedisKey(productId, skuCode).toRedisKey()

        val result = redisTemplate.execute(
            decreaseInventoryScript,
            listOf(redisKey),
            amount.toString()
        )

        if (result == RedisConfig.InventoryScriptError.NO_CACHED_INVENTORY_FOUND.errorCode)
            throw InventoryException.NoCachedInventoryFound()

        if (result == RedisConfig.InventoryScriptError.INVENTORY_NOT_ENOUGH.errorCode)
            throw InventoryException.InventoryNotEnough()

        return result.toInt()
    }

    override fun increase(productId: String, skuCode: String, amount: Int): Int {
        TODO("Not yet implemented")
    }
}