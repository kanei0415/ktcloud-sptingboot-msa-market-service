package dev.ktcloud.black.user.domain.vo

enum class UserRole {
    ANONYMOUS, USER, ADMIN;

    companion object {
        val Authority = RoleAuthority
    }
}