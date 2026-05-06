package dev.ktcloud.black.user.api.gateway.adapter.presentation.web.inbound.order.request

import dev.ktcloud.black.user.api.gateway.application.order.dto.OrderLineItemDto

data class CreateOrderRequest(
    val items: List<OrderLineItemDto>
)
