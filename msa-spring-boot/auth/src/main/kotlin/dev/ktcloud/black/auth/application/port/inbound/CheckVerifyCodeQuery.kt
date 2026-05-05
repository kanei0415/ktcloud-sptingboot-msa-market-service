package dev.ktcloud.black.auth.application.port.inbound

interface CheckVerifyCodeQuery {
    fun checkVerifyCode(query: In): Out

    data class In(
        val email: String,
        val verifyCode: String,
    )

    data class Out(
        val verified: Boolean,
    )
}