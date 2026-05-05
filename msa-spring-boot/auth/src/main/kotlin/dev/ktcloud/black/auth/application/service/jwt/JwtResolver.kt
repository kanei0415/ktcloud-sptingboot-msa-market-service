package dev.ktcloud.black.auth.application.service.jwt

import io.jsonwebtoken.Claims
import io.jsonwebtoken.JwtException
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import javax.crypto.SecretKey

@Component
class JwtResolver(
    @Value("\${jwt.secret}") private val secretKey: String
) {
    private val signingKey: SecretKey = Keys.hmacShaKeyFor(secretKey.toByteArray())

    fun extractClaims(token: String): Claims {
        val claims = Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .payload

        return claims
    }

    fun validateToken(token: String): Boolean {
        return try {
            Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
            true
        } catch (_: JwtException) {
            false
        }
    }
}