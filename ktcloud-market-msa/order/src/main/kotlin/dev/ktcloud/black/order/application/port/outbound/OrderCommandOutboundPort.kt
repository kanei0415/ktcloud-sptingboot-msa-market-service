package dev.ktcloud.black.order.application.port.outbound

import dev.ktcloud.black.order.domain.entity.OrderDomainEntity

interface OrderCommandOutboundPort {
    fun save(orderDomainEntity: OrderDomainEntity)
}