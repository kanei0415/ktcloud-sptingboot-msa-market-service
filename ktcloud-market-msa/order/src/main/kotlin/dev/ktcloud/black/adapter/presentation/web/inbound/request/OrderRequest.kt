package dev.ktcloud.black.adapter.presentation.web.inbound.request

import dev.ktcloud.black.application.dto.OrderItemDto

data class OrderRequest(
    val items: List<OrderItemDto>
)