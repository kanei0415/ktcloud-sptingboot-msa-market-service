package dev.ktcloud.black.order.order.application.service

import dev.ktcloud.black.order.order.application.dto.event.outbound.InventoryReserveRequestEvent
import dev.ktcloud.black.order.order.application.port.event.OrderInventoryEventPublishPort
import dev.ktcloud.black.order.order.application.port.inbound.CreateOrderCommand
import dev.ktcloud.black.order.order.application.port.outbound.OrderCommandOutboundPort
import dev.ktcloud.black.order.order.application.port.outbound.OrderQueryOutboundPort
import dev.ktcloud.black.order.order.domain.entity.OrderDomainEntity
import dev.ktcloud.black.order.order.domain.vo.OrderLineItemStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class OrderCommandService(
    private val orderCommandOutboundPort: OrderCommandOutboundPort,
    private val orderQueryOutboundPort: OrderQueryOutboundPort,
    private val orderInventoryEventPublishPort: OrderInventoryEventPublishPort
): CreateOrderCommand {
    @Transactional
    override fun create(command: CreateOrderCommand.In) {
        val orderDomainEntity = OrderDomainEntity(
            _orderLineItems = command.orderLineItems
        )

        val savedOrder = orderCommandOutboundPort.save(orderDomainEntity)

        orderDomainEntity.orderLineItems.forEach {
            orderInventoryEventPublishPort.publish(
                InventoryReserveRequestEvent(
                    orderId = savedOrder.id,
                    inventoryId = it.inventoryId,
                    amount = it.quantity
                )
            )
        }
    }

    @Transactional
    fun updateOrderLineItemStatus(orderId: Long, inventoryId: Long, status: OrderLineItemStatus) {
        val order = orderQueryOutboundPort.fetchOrder(orderId)

        order.updateOrderLineItem(inventoryId, status)

        orderCommandOutboundPort.save(order)
    }
}