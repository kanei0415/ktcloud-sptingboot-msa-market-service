package dev.ktcloud.black.identification.adapter.presentation.web.inbound.response

import dev.ktcloud.black.identification.application.port.inbound.VerifyCodeCommand

data class IdentifyResponse( val resultCode: String) {
    companion object {
        fun from(payload: VerifyCodeCommand.Out) = IdentifyResponse(
            resultCode = payload.resultCode,
        )
    }
}
