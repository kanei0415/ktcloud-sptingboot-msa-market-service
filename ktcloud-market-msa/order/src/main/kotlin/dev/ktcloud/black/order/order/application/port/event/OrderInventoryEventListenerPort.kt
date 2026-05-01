package dev.ktcloud.black.order.order.application.port.event

import dev.ktcloud.black.order.application.dto.event.inbound.InventoryReservedResultEvent

interface OrderInventoryEventListenerPort {
    fun onResultPublished(event: InventoryReservedResultEvent)
}