package dev.ktcloud.black.identification.adapter.presentation.web.inbound

import dev.ktcloud.black.identification.adapter.presentation.web.inbound.request.IdentifyRequest
import dev.ktcloud.black.identification.adapter.presentation.web.inbound.request.IssueEmailIdentificationCodeRequest
import dev.ktcloud.black.identification.adapter.presentation.web.inbound.response.IdentifyResponse

interface ExternalIdentificationRestController {
    fun issueEmailIdentificationCode(issueEmailIdentificationCodeRequest: IssueEmailIdentificationCodeRequest)
    fun identify(identifyRequest: IdentifyRequest): IdentifyResponse
}