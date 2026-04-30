package dev.ktcloud.black.order.domain.vo

import jakarta.persistence.Embeddable
import java.math.BigDecimal

@Embeddable
data class OrderLineItem(
    val inventoryId: Long,
    val productId: String,
    val skuCode: String,
    val price: BigDecimal,
    val quantity: Int,
)