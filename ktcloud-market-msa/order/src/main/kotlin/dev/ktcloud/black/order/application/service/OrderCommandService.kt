package dev.ktcloud.black.order.application.service

import dev.ktcloud.black.order.application.port.inbound.CreateOrderCommand
import dev.ktcloud.black.order.application.port.outbound.OrderCommandOutboundPort
import dev.ktcloud.black.order.domain.entity.OrderDomainEntity
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class OrderCommandService(
    private val orderCommandOutboundPort: OrderCommandOutboundPort
): CreateOrderCommand {
    @Transactional
    override fun create(command: CreateOrderCommand.In) {
        val orderDomainEntity = OrderDomainEntity(
            orderNumber = command.orderNumber,
            orderLineItems = command.orderLineItems
        )

        orderCommandOutboundPort.save(orderDomainEntity)
    }
}