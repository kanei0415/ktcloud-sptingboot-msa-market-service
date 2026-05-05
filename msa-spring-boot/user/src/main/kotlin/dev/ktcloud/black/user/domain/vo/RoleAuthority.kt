package dev.ktcloud.black.user.domain.vo

object RoleAuthority {
    const val hasUserRole = "hasAnyAuthority('USER')"
    const val hasAdminRole = "hasAnyAuthority('ADMIN')"
    const val hasAllRoles = "hasAnyAuthority('USER', 'ADMIN', 'ANONYMOUS')"
}