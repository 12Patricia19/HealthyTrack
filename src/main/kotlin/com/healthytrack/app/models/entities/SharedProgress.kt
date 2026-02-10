package com.healthytrack.app.models.entities

import jakarta.persistence.*
import com.fasterxml.jackson.annotation.JsonIgnore

@Entity
@Table(name = "shared_progress")
data class SharedProgress(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    val user: User,

    @Column(name = "share_type", nullable = false, length = 50)
    val shareType: String,

    @Column(nullable = false)
    val title: String,

    @Column(columnDefinition = "TEXT")
    val description: String? = null,

    @Column(name = "progress_data", nullable = false, columnDefinition = "JSONB")
    val progressData: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_with_user_id")
    @JsonIgnore
    val sharedWithUser: User? = null,

    @Column(name = "external_platform", length = 50)
    val externalPlatform: String? = null,

    @Column(name = "external_url", columnDefinition = "TEXT")
    val externalUrl: String? = null,

    @Column(name = "is_public")
    val isPublic: Boolean = false
) : BaseEntity()
