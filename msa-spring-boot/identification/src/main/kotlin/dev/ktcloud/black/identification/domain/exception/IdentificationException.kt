package dev.ktcloud.black.identification.domain.exception

import dev.ktcloud.black.common.exception.CustomException
import org.springframework.http.HttpStatus

sealed class IdentificationException {
    class NoSuchCodeException(message: String? = null, e: Throwable? = null): CustomException("001", message ?: "認証コードが見つかりません", HttpStatus.NOT_FOUND, e)
    class AlreadyVerifiedException(message: String? = null, e: Throwable? = null): CustomException("002", message ?: "すでに締め切られました", HttpStatus.BAD_REQUEST, e)
    class InvalidCodeException(message: String? = null, e: Throwable? = null): CustomException("003", message ?: "間違った認証コードです", HttpStatus.FORBIDDEN, e)
    class CodeExpiredException(message: String? = null, e: Throwable? = null): CustomException("004", message ?: "締め切られました認証コードです", HttpStatus.BAD_REQUEST, e)
    class NotVerifiedException(message: String? = null, e: Throwable? = null): CustomException("005", message ?: "認証されていないコードです", HttpStatus.BAD_REQUEST, e)
}