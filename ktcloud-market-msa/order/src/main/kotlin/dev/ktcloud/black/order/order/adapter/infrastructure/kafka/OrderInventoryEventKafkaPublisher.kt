package dev.ktcloud.black.order.order.adapter.infrastructure.kafka

import dev.ktcloud.black.order.adapter.infrastructure.kafka.mapper.OrderInventoryPublishEventMapper
import dev.ktcloud.black.order.adapter.infrastructure.kafka.model.InventoryReserveRequestMessage
import dev.ktcloud.black.order.application.dto.event.outbound.InventoryReserveRequestEvent
import dev.ktcloud.black.order.application.port.event.OrderInventoryEventPublishPort
import org.springframework.beans.factory.annotation.Value
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Component

@Component
class OrderInventoryEventKafkaPublisher(
    private val kafkaTemplate: KafkaTemplate<String, InventoryReserveRequestMessage>,
    private val mapper: OrderInventoryPublishEventMapper,
    @Value("\${spring.kafka.topic.inventory-reserve-request}")
    private val topicName: String
): OrderInventoryEventPublishPort {
    override fun publish(event: InventoryReserveRequestEvent) {
        val message = mapper.toMessage(event)

        kafkaTemplate.send(topicName, message.orderId.toString(), message)
    }
}