package dev.ktcloud.black.order.domain.entity

import dev.ktcloud.black.order.domain.exception.OrderException
import dev.ktcloud.black.order.domain.vo.OrderLineItem
import dev.ktcloud.black.order.domain.vo.OrderStatus

data class OrderDomainEntity(
    val id: Long = 0L,
    private var _status: OrderStatus,
    val orderLineItems: List<OrderLineItem>,
) {
    val status: OrderStatus
        get() = _status

    fun changeStatus(status: OrderStatus) {
        if (!_status.checkTransitive(status)) throw OrderException.IllegalOrderStatusTransitiveException()

        _status = status
    }
}