package dev.ktcloud.black.auth.application.port.inbound

interface GenerateVerifyCodeCommand {
    fun generateCode(command: In): Out

    data class In(val email: String)

    data class Out(val issued: Boolean)
}