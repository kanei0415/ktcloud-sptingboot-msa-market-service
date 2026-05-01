package dev.ktcloud.black.inventory.adapter.infrastructure.kafka

import dev.ktcloud.black.inventory.adapter.infrastructure.kafka.mapper.InventoryOrderPublishEventMapper
import dev.ktcloud.black.inventory.adapter.infrastructure.kafka.model.InventoryReservedResultMessage
import dev.ktcloud.black.inventory.application.dto.event.outbound.InventoryReservedResultEvent
import dev.ktcloud.black.inventory.application.port.event.InventoryOrderEventPublishPort
import org.springframework.beans.factory.annotation.Value
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Component

@Component
class InventoryOrderEventKafkaPublisher(
    private val kafkaTemplate: KafkaTemplate<String, InventoryReservedResultMessage>,
    private val mapper: InventoryOrderPublishEventMapper,
    @Value("\${spring.kafka.topic.inventory-reserved-result}")
    private val topicName: String
): InventoryOrderEventPublishPort {
    override fun publish(event: InventoryReservedResultEvent) {
        val message = mapper.toMessage(event)

        val future = kafkaTemplate.send(topicName, message.orderId.toString(), message)

        future.whenComplete { result, ex ->
            if (ex == null) {
                println("Sent message to [$topicName] offset:[${result.recordMetadata.offset()}]")
            } else {
                System.err.println("Unable to send message to [$topicName] due to : ${ex.message}")
            }
        }
    }
}