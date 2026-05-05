package dev.ktcloud.black.auth.adapter.presentation.web.filter

import dev.ktcloud.black.auth.application.service.jwt.JwtResolver
import dev.ktcloud.black.user.domain.vo.UserDetail
import dev.ktcloud.black.user.domain.vo.UserRole
import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtParser
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.filter.OncePerRequestFilter
import java.util.UUID

class JwtAuthenticationFilter(
    private val jwtResolver: JwtResolver
) : OncePerRequestFilter() {
    private fun resolveToken(request: HttpServletRequest): String? {
        val bearerToken = request.getHeader("Authorization")
        return if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            bearerToken.substring(7)
        } else null
    }

    private fun tokenToAuthentication(token: String): Authentication {
        val claims = jwtResolver.extractClaims(token)

        val role = claims["role"] as? String ?: "USER"

        val authorities = listOf(SimpleGrantedAuthority(role))

        val userDetail = UserDetail(
            id = UUID.fromString(claims.subject),
            role = UserRole.valueOf(role),
            email = claims["email"] as String,
            name = claims["name"] as String,
        )
        
        return UsernamePasswordAuthenticationToken(userDetail, token, authorities)
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = resolveToken(request)

        if (token != null && jwtResolver.validateToken(token))
            SecurityContextHolder.getContext().authentication = tokenToAuthentication(token)

        filterChain.doFilter(request, response)
    }
}