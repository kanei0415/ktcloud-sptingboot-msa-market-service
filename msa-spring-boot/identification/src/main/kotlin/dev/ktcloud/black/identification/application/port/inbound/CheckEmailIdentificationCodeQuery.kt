package dev.ktcloud.black.identification.application.port.inbound

interface CheckEmailIdentificationCodeQuery {
    fun checkEmailIdentificationCode(query: In): Out
    
    data class In(val emailResultCode: String)
    data class Out(val email: String)
}