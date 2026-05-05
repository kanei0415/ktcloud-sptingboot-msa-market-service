package dev.ktcloud.black.identification.adapter.infrastructure.jpa.repository

import dev.ktcloud.black.identification.adapter.infrastructure.jpa.IdentificationMapper
import dev.ktcloud.black.identification.application.port.outbound.IdentificationCommandOutboundPort
import dev.ktcloud.black.identification.domain.entity.IdentificationDomainEntity
import org.springframework.stereotype.Component

@Component
class IdentificationPostgresqlCommandRepositoryAdapter(
    private val repository: IdentificationPostgresqlRepository,
    private val mapper: IdentificationMapper,
): IdentificationCommandOutboundPort {
    override fun save(identification: IdentificationDomainEntity): IdentificationDomainEntity =
        repository.save(mapper.toOrmEntity(identification))
            .let(mapper::toDomainEntity)

    override fun saveAll(identifications: List<IdentificationDomainEntity>): List<IdentificationDomainEntity> {
        return repository.saveAll(identifications.map(mapper::toOrmEntity))
            .map(mapper::toDomainEntity)
    }
}