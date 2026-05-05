package dev.ktcloud.black.identification.application.port.outbound

import dev.ktcloud.black.identification.domain.entity.IdentificationDomainEntity

interface IdentificationQueryOutboundPort {
    fun findActive(key: String, code: String? = null): IdentificationDomainEntity?
    fun findLatest(key: String, verified: Boolean): IdentificationDomainEntity?
    fun getByKeyAndCode(key: String, code: String): IdentificationDomainEntity
    fun getByResultCode(resultCode: String): IdentificationDomainEntity
}