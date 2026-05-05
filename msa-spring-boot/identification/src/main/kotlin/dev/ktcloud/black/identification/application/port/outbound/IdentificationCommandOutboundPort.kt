package dev.ktcloud.black.identification.application.port.outbound

import dev.ktcloud.black.identification.domain.entity.IdentificationDomainEntity

interface IdentificationCommandOutboundPort {
    fun save(identification: IdentificationDomainEntity): IdentificationDomainEntity
    fun saveAll(identifications: List<IdentificationDomainEntity>): List<IdentificationDomainEntity>
}