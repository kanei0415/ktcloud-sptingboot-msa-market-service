package dev.ktcloud.black.identification.application.port.inbound

interface CheckIdentificationCodeQuery {
    fun checkCode(query: In): Out
    
    data class In(val encodedResultCode: String)
    data class Out(val phone: String, val email: String)
}