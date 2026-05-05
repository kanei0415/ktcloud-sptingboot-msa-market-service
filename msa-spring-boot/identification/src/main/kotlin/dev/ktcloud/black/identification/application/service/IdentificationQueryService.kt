package dev.ktcloud.black.identification.application.service

import dev.ktcloud.black.identification.application.port.inbound.CheckEmailIdentificationCodeQuery
import dev.ktcloud.black.identification.application.port.inbound.CheckIdentificationCodeQuery
import dev.ktcloud.black.identification.application.port.outbound.IdentificationQueryOutboundPort
import dev.ktcloud.black.identification.domain.exception.IdentificationException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.Base64

@Service
class IdentificationQueryService(
    private val identificationQueryOutboundPort: IdentificationQueryOutboundPort,
): CheckIdentificationCodeQuery, CheckEmailIdentificationCodeQuery {
    @Transactional(readOnly = true)
    override fun checkCode(query: CheckIdentificationCodeQuery.In): CheckIdentificationCodeQuery.Out {
        val (phoneResultCode, emailResultCode) = parseEncodedResultCode(query.encodedResultCode)
        val phone = identificationQueryOutboundPort.getByResultCode(phoneResultCode).apply {
            check(key = key, code = code)
        }
        val email = identificationQueryOutboundPort.getByResultCode(emailResultCode).apply {
            check(key = key, code = code)
        }
        return CheckIdentificationCodeQuery.Out(
            phone = phone.key,
            email = email.key,
        )
    }

    @Transactional(readOnly = true)
    override fun checkEmailIdentificationCode(query: CheckEmailIdentificationCodeQuery.In): CheckEmailIdentificationCodeQuery.Out {
        return CheckEmailIdentificationCodeQuery.Out(
            email = identificationQueryOutboundPort.getByResultCode(query.emailResultCode).key,
        )
    }

    private fun parseEncodedResultCode(encodedResultCode: String): Pair<String, String> {
        return Base64.getDecoder().decode(encodedResultCode).toString(Charsets.UTF_8)
            .let {
                val splitParts = it.split(":")
                if (splitParts.size == 2 && splitParts[0].isNotBlank() && splitParts[1].isNotBlank()) {
                    Pair(splitParts[0], splitParts[1])
                } else {
                    throw IdentificationException.InvalidCodeException()
                }
            }
    }

    private fun check(key: String, code: String) {
        identificationQueryOutboundPort.getByKeyAndCode(key = key, code = code).let {
            it.checkExpired()
            it.checkNotVerified()
        }

        val latest = identificationQueryOutboundPort.findLatest(key = key, verified = true)
        checkNotNull(latest) {
            throw IdentificationException.NoSuchCodeException()
        }

        if (latest.code != code)
            throw IdentificationException.InvalidCodeException()

    }
}