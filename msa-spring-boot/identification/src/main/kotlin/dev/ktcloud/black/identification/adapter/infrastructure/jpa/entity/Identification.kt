package dev.ktcloud.black.identification.adapter.infrastructure.jpa.entity

import dev.ktcloud.black.common.domain.entity.BaseOrmEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.SQLDelete
import java.time.LocalDateTime
import java.util.UUID

@SQLDelete(sql = "UPDATE identifications SET deleted_at = NOW() WHERE id = ?")
@Entity
@Table(name = "identifications")
class Identification(
    @Id
    @Column(columnDefinition = "uuid")
    val id: UUID,

    @Column
    val key: String,

    @Column
    val code: String,

    @Column
    val resultCode: String?,

    @Column
    val issuedAt: LocalDateTime,

    @Column
    val expireAt: LocalDateTime,

    @Column
    val verifiedAt: LocalDateTime?,
): BaseOrmEntity()