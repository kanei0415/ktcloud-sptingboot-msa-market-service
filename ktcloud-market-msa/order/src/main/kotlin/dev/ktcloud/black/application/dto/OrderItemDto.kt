package dev.ktcloud.black.application.dto

import java.math.BigDecimal

data class OrderItemDto(
    val id: Long,
    val skuCode: String,
    val price: BigDecimal,
    val quantity: Int,
)
