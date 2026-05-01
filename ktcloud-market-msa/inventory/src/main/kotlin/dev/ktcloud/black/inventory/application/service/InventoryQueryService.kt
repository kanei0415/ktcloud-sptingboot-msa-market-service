package dev.ktcloud.black.inventory.application.service

import dev.ktcloud.black.client.redis.api.DistributedLock
import dev.ktcloud.black.inventory.application.port.inbound.query.FetchInventoryQuery
import dev.ktcloud.black.inventory.application.port.outbound.LoadCacheSyncedInventoryOutboundPort
import dev.ktcloud.black.inventory.domain.exception.InventoryException
import dev.ktcloud.black.inventory.domain.vo.InventoryLockKey
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class InventoryQueryService(
    private val distributedLock: DistributedLock,
    private val loadCacheSyncedInventoryOutboundPort: LoadCacheSyncedInventoryOutboundPort,
): FetchInventoryQuery {
    @Transactional(readOnly = true)
    override fun fetch(query: FetchInventoryQuery.In): FetchInventoryQuery.Out {
        val inventory = try {
            loadCacheSyncedInventoryOutboundPort.loadInventory(query.id)
        } catch (_: InventoryException.NoCachedInventoryFound) {
            distributedLock.execute(
                key = InventoryLockKey(query.id).toLockKey(),
                func = {
                    loadCacheSyncedInventoryOutboundPort.loadCacheSyncedInventory(query.id)
                }
            )
        }

        return FetchInventoryQuery.Out.from(inventory)
    }
}