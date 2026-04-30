package dev.ktcloud.black.order.application.port.inbound

import dev.ktcloud.black.order.domain.vo.OrderLineItem

interface CreateOrderCommand {
    fun create(command: In)

    data class In(
        val orderNumber: String,
        val orderLineItems: List<OrderLineItem>,
    )
}