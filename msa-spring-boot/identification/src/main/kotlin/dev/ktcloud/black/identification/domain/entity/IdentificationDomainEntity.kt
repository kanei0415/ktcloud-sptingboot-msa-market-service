package dev.ktcloud.black.identification.domain.entity

import dev.ktcloud.black.common.util.time.now
import dev.ktcloud.black.identification.domain.exception.IdentificationException
import java.time.LocalDateTime
import java.util.UUID

data class IdentificationDomainEntity(
    val id: UUID = UUID.randomUUID(),
    val key: String,
    val code: String,
    val issuedAt: LocalDateTime = now(),
    private var _resultCode: String? = null,
    private var _expireAt: LocalDateTime = issuedAt.plusSeconds(TTL_SECONDS),
    private var _verifiedAt: LocalDateTime? = null
) {
   companion object {
       const val TTL_SECONDS = 180L
   }

    val resultCode: String?
        get() = _resultCode

    val expireAt: LocalDateTime
        get() = _expireAt

    val verifiedAt: LocalDateTime?
        get() = _verifiedAt

    fun verify(
        key: String,
        code: String,
        now: LocalDateTime = now(),
        resultCode: String = UUID.randomUUID().toString(),
    ) {
        if (this.code != code) {
            throw IdentificationException.InvalidCodeException()
        }
        if (this.key != key) {
            throw IdentificationException.InvalidCodeException()
        }
        checkAlreadyVerified()
        checkExpired(now)
        _expireAt = now.plusMinutes(10)
        _verifiedAt = now
        _resultCode = resultCode
    }

    fun renew(
        code: String,
        issuedAt: LocalDateTime = LocalDateTime.now(),
        expireAt: LocalDateTime = issuedAt.plusSeconds(TTL_SECONDS),
    ): IdentificationDomainEntity {
        checkAlreadyVerified()
        return this.copy(
            code = code,
            issuedAt = issuedAt,
            _expireAt = expireAt,
            _verifiedAt = null
        )
    }

    fun checkExpired(now: LocalDateTime = now()) {
        if (_expireAt.isBefore(now)) {
            throw IdentificationException.CodeExpiredException()
        }
    }

    fun checkAlreadyVerified() {
        if (_verifiedAt != null) {
            throw IdentificationException.AlreadyVerifiedException()
        }
    }

    fun checkNotVerified() {
        if (_verifiedAt == null) {
            throw IdentificationException.NotVerifiedException()
        }
    }
}