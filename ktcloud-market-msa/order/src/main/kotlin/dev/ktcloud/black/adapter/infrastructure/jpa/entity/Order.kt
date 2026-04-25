package dev.ktcloud.black.adapter.infrastructure.jpa.entity

import jakarta.persistence.Entity
import org.hibernate.annotations.SQLDelete

@SQLDelete(sql = "UPDATE format SET deleted_at = NOW() WHERE id = ?")
@Entity
data class Order()
