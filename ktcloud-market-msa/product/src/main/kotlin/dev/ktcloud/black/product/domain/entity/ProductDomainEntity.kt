package dev.ktcloud.black.product.domain.entity

import java.math.BigDecimal

data class ProductDomainEntity(
    val id: String = "",
    val name: String,
    val description: String,
    val price: BigDecimal,
)