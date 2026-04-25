package dev.ktcloud.black.order.domain.vo

import java.math.BigDecimal

data class OrderItem(
    val id: Long,
    val skuCode: String,
    val price: BigDecimal,
    val quantity: Int,
)