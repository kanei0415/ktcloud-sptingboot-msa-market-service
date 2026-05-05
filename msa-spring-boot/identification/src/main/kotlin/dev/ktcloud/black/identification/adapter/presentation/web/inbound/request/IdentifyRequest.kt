package dev.ktcloud.black.identification.adapter.presentation.web.inbound.request

import dev.ktcloud.black.identification.application.port.inbound.VerifyCodeCommand

data class IdentifyRequest(
    val key: String,
    val code: String,
) {
    fun toDomain(): VerifyCodeCommand.In = VerifyCodeCommand.In(
        key = key,
        code = code,
    )
}