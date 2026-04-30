package dev.ktcloud.black.product.application.port.inbound

import java.math.BigDecimal

interface FetchAllProductsQuery {
    fun fetchAll(): List<Out>

    data class Out(
        val id: String,
        val name: String,
        val description: String,
        val price: BigDecimal,
    )
}