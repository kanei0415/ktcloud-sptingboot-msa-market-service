package dev.ktcloud.black.product.application.port.inbound

import java.math.BigDecimal

interface CreateProductCommand {
    fun createProduct(command: In)

    data class In(
        val name: String,
        val description: String,
        val price: BigDecimal,
    )
}