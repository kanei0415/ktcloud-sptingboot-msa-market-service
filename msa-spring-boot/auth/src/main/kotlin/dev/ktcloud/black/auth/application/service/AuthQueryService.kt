package dev.ktcloud.black.auth.application.service

import dev.ktcloud.black.auth.application.port.inbound.CheckVerifyCodeQuery
import dev.ktcloud.black.identification.application.port.outbound.IdentificationQueryOutboundPort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthQueryService(
    private val identificationQueryOutboundPort: IdentificationQueryOutboundPort
): CheckVerifyCodeQuery {
    @Transactional(readOnly = true)
    override fun checkVerifyCode(query: CheckVerifyCodeQuery.In): CheckVerifyCodeQuery.Out {
        val identification = identificationQueryOutboundPort.findActive(
                key = query.email,
                code = query.verifyCode
            )

        return CheckVerifyCodeQuery.Out(
            verified = identification != null
        )
    }
}