package dev.ktcloud.black.order.domain.entity

import dev.ktcloud.black.order.domain.vo.OrderItem

data class OrderDomainEntity(
    val id: Long,
    val orderNumber: String,
    val orderItems: List<OrderItem>,
)