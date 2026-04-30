package dev.ktcloud.black.order.domain.exception

import dev.ktcloud.black.common.exception.CustomException
import org.springframework.http.HttpStatus

sealed class OrderException {
    class IllegalOrderStatusTransitiveException(message: String? = null, e: Throwable? = null): CustomException(
        "001",
        message ?: "間違えたステータス転移です",
        HttpStatus.BAD_REQUEST,
        e
    )
}