package com.healthytrack.app.models.entities

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table

@Entity
@Table(name = "roles")
data class Role(
    @Column(nullable = false, unique = true, length = 50)
    val name: String,

    @Column(columnDefinition = "TEXT")
    val description: String? = null
) : BaseEntity()
