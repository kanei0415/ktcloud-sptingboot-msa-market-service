package dev.ktcloud.black.identification.application.port.inbound

interface VerifyCodeCommand {
    fun verify(command: In): Out

    data class In(
        val key: String,
        val code: String,
    )

    data class Out(val resultCode: String)
}