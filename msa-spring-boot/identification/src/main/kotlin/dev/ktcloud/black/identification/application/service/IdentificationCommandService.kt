package dev.ktcloud.black.identification.application.service

import dev.ktcloud.black.identification.application.port.inbound.IssueCodeCommand
import dev.ktcloud.black.identification.application.port.inbound.VerifyCodeCommand
import dev.ktcloud.black.identification.application.port.outbound.IdentificationCommandOutboundPort
import dev.ktcloud.black.identification.application.port.outbound.IdentificationQueryOutboundPort
import dev.ktcloud.black.identification.domain.entity.IdentificationDomainEntity
import dev.ktcloud.black.identification.domain.exception.IdentificationException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class IdentificationCommandService(
    private val identificationQueryOutboundPort: IdentificationQueryOutboundPort,
    private val identificationCommandOutboundPort: IdentificationCommandOutboundPort,
): VerifyCodeCommand, IssueCodeCommand {
    @Transactional
    override fun verify(command: VerifyCodeCommand.In): VerifyCodeCommand.Out {
        val identification = identificationQueryOutboundPort.findLatest(key = command.key, verified = false)
            ?: throw IdentificationException.NoSuchCodeException()
        identification.verify(key = command.key, code = command.code)
        return identificationCommandOutboundPort.save(identification).let {
            VerifyCodeCommand.Out(
                resultCode = checkNotNull(it.resultCode) {
                    "Identification result code is null"
                }
            )
        }
    }

    @Transactional
    override fun issue(command: IssueCodeCommand.In): IssueCodeCommand.Out {
        val alreadyActiveIdentification = identificationQueryOutboundPort.findActive(key = command.key)
        val identification = alreadyActiveIdentification?.renew(code = command.code, issuedAt = command.issuedAt)
            ?: IdentificationDomainEntity(
                key = command.key,
                code = command.code,
                issuedAt = command.issuedAt,
                _expireAt = command.expireAt,
            )
        identificationCommandOutboundPort.save(identification).let {


            return IssueCodeCommand.Out(
                code = it.code,
                issuedAt = it.issuedAt,
                expiredAt = it.expireAt
            )
        }
    }
}