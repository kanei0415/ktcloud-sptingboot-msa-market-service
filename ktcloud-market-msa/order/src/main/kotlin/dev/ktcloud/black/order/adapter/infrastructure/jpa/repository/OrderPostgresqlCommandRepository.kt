package dev.ktcloud.black.order.adapter.infrastructure.jpa.repository

import dev.ktcloud.black.order.adapter.infrastructure.jpa.OrderMapper
import dev.ktcloud.black.order.application.port.outbound.OrderCommandOutboundPort
import dev.ktcloud.black.order.domain.entity.OrderDomainEntity
import org.springframework.stereotype.Component

@Component
class OrderPostgresqlCommandRepository(
    private val repository: OrderPostgresqlRepository,
    private val orderMapper: OrderMapper
): OrderCommandOutboundPort {
    override fun save(orderDomainEntity: OrderDomainEntity) {
        val orderOrmEntity = orderMapper.toOrmEntity(orderDomainEntity)

        repository.save(orderOrmEntity)
    }
}