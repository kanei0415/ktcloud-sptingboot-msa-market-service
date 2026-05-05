package dev.ktcloud.black.auth.application.service

import dev.ktcloud.black.auth.application.port.inbound.GenerateVerifyCodeCommand
import dev.ktcloud.black.client.ses.core.SendMailUseCase
import dev.ktcloud.black.identification.application.port.outbound.IdentificationCommandOutboundPort
import dev.ktcloud.black.identification.domain.entity.IdentificationDomainEntity
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthCommandService(
    private val sendMailUseCase: SendMailUseCase,
    private val identificationCommandOutboundPort: IdentificationCommandOutboundPort
): GenerateVerifyCodeCommand {
    companion object {
        const val VERIFY_MAIL_TITLE = "認証メールです"
    }

    private fun generateVerifyCode(): String {
        return (0..999999).random().toString().padStart(6, '0')
    }

    private fun getMailContents(code: String): String = "認証番号: $code"

    @Transactional
    override fun generateCode(command: GenerateVerifyCodeCommand.In): GenerateVerifyCodeCommand.Out {
        val identification = IdentificationDomainEntity(
            key = command.email,
            code = generateVerifyCode(),
        )

        val success = try {
            identificationCommandOutboundPort.save(identification)

            sendMailUseCase.sendMail(
                SendMailUseCase.In(
                    mailTo = command.email,
                    title = VERIFY_MAIL_TITLE,
                    content = getMailContents(identification.code)
                )
            )

            true
        } catch (_: Exception) {
            false
        }

        return GenerateVerifyCodeCommand.Out(
            issued = success
        )
    }
}