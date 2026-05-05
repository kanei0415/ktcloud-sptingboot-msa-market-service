package dev.ktcloud.black.identification.adapter.infrastructure.jpa.repository

import dev.ktcloud.black.identification.adapter.infrastructure.jpa.entity.Identification
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface IdentificationPostgresqlRepository: CrudRepository<Identification, UUID> {
    fun findByResultCode(resultCode: String): Identification?
    fun getByKeyAndCode(key: String, code: String): Identification
}