package dev.ktcloud.black.identification.adapter.infrastructure.jpa

import dev.ktcloud.black.common.adapter.infrastructure.jpa.EntityMapper
import dev.ktcloud.black.identification.adapter.infrastructure.jpa.entity.Identification
import dev.ktcloud.black.identification.domain.entity.IdentificationDomainEntity
import org.springframework.stereotype.Component

@Component
class IdentificationMapper: EntityMapper<Identification, IdentificationDomainEntity>{
    override fun toOrmEntity(domainEntity: IdentificationDomainEntity): Identification {
        return Identification(
            id = domainEntity.id,
            key = domainEntity.key,
            code = domainEntity.code,
            resultCode = domainEntity.resultCode,
            issuedAt = domainEntity.issuedAt,
            expireAt = domainEntity.expireAt,
            verifiedAt = domainEntity.verifiedAt,
        )
    }

    override fun toDomainEntity(entity: Identification): IdentificationDomainEntity {
        return IdentificationDomainEntity(
            id = entity.id,
            key = entity.key,
            code = entity.code,
            _resultCode = entity.resultCode,
            issuedAt = entity.issuedAt,
            _expireAt = entity.expireAt,
            _verifiedAt = entity.verifiedAt,
        )
    }
}