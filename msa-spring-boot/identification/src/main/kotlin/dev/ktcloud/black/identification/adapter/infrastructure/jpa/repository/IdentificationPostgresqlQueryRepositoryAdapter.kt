package dev.ktcloud.black.identification.adapter.infrastructure.jpa.repository

import com.querydsl.core.types.dsl.BooleanExpression
import com.querydsl.jpa.impl.JPAQueryFactory
import dev.ktcloud.black.identification.adapter.infrastructure.jpa.IdentificationMapper
import dev.ktcloud.black.identification.adapter.infrastructure.jpa.entity.QIdentification.identification
import dev.ktcloud.black.identification.application.port.outbound.IdentificationQueryOutboundPort
import dev.ktcloud.black.identification.domain.entity.IdentificationDomainEntity
import dev.ktcloud.black.identification.domain.exception.IdentificationException
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class IdentificationPostgresqlQueryRepositoryAdapter(
    private val repository: IdentificationPostgresqlRepository,
    private val mapper: IdentificationMapper,
    private val jpaQueryFactory: JPAQueryFactory,
): IdentificationQueryOutboundPort {
    override fun findActive(key: String, code: String?): IdentificationDomainEntity? {
        return jpaQueryFactory
            .selectFrom(identification)
            .where(
                eqKey(key),
                eqCode(code),
                identification.expireAt.gt(LocalDateTime.now()),
                identification.verifiedAt.isNull,
                identification.deletedAt.isNull,
            )
            .orderBy(identification.issuedAt.desc())
            .fetchOne()
            ?.let {
                mapper.toDomainEntity(it)
            }
    }

    override fun findLatest(key: String, verified: Boolean): IdentificationDomainEntity? {
        val qb = jpaQueryFactory
            .selectFrom(identification)
            .where(
                eqKey(key),
                identification.deletedAt.isNull,
            )

        if (verified) {
            qb.where(identification.verifiedAt.isNotNull)
        } else {
            qb.where(identification.verifiedAt.isNull)
        }

        return qb
            .orderBy(identification.issuedAt.desc())
            .fetchFirst()
            ?.let {
                mapper.toDomainEntity(it)
            }
    }

    override fun getByKeyAndCode(key: String, code: String): IdentificationDomainEntity {
        return repository.getByKeyAndCode(key = key, code = code).let {
            mapper.toDomainEntity(it)
        }
    }

    override fun getByResultCode(resultCode: String): IdentificationDomainEntity {
        val identification = checkNotNull(repository.findByResultCode(resultCode)) {
            throw IdentificationException.NoSuchCodeException()
        }
        return mapper.toDomainEntity(identification)
    }

    private fun eqKey(key: String?): BooleanExpression? {
        return key?.let { identification.key.eq(it) }
    }

    private fun eqCode(code: String?): BooleanExpression? {
        return code?.let { identification.code.eq(it) }
    }
}