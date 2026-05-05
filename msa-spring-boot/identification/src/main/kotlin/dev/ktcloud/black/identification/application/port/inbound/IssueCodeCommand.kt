package dev.ktcloud.black.identification.application.port.inbound

import dev.ktcloud.black.identification.domain.entity.IdentificationDomainEntity
import java.time.LocalDateTime

interface IssueCodeCommand {
    fun issue(command: In): Out

    data class In(
        val key: String,
        val code: String = (100000..999999).random().toString(),
        val issuedAt: LocalDateTime = LocalDateTime.now(),
        val expireAt: LocalDateTime = issuedAt.plusSeconds(IdentificationDomainEntity.TTL_SECONDS),
    )

    data class Out(
        val code: String,
        val issuedAt: LocalDateTime,
        val expiredAt: LocalDateTime,
    )
}