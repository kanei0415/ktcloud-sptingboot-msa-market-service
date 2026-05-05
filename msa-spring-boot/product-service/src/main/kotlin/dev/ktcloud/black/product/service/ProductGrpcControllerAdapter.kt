package dev.ktcloud.black.product.service

import dev.ktcloud.black.product.application.port.inbound.CreateProductCommand
import dev.ktcloud.black.product.application.port.inbound.FetchAllProductsQuery
import dev.ktcloud.black.product.application.port.inbound.FetchProductQuery
import dev.ktcloud.black.product.service.adapter.presentation.web.inbound.grpc.CreateProductRequest
import dev.ktcloud.black.product.service.adapter.presentation.web.inbound.grpc.CreateProductResponse
import dev.ktcloud.black.product.service.adapter.presentation.web.inbound.grpc.Empty
import dev.ktcloud.black.product.service.adapter.presentation.web.inbound.grpc.FetchAllProductsResponse
import dev.ktcloud.black.product.service.adapter.presentation.web.inbound.grpc.FetchProductRequest
import dev.ktcloud.black.product.service.adapter.presentation.web.inbound.grpc.FetchProductResponse
import dev.ktcloud.black.product.service.adapter.presentation.web.inbound.grpc.ProductResponseDto
import dev.ktcloud.black.product.service.adapter.web.inbound.ProductGrpcController
import net.devh.boot.grpc.server.service.GrpcService

@GrpcService
class ProductGrpcControllerAdapter(
    private val createProductCommand: CreateProductCommand,
    private val fetchAllProductsQuery: FetchAllProductsQuery,
    private val fetchProductQuery: FetchProductQuery
): ProductGrpcController() {
    private fun buildProductResponseDto(
        id: String,
        name: String,
        description: String,
        price: Int,
    ): ProductResponseDto = ProductResponseDto.newBuilder()
        .setId(id)
        .setName(name)
        .setDescription(description)
        .setPrice(price)
        .build()

    override suspend fun createProduct(request: CreateProductRequest): CreateProductResponse {
        val created = createProductCommand.createProduct(
            CreateProductCommand.In(
                name = request.name,
                description = request.description,
                price = request.price
            )
        )

        val productDto = buildProductResponseDto(
            id = created.name,
            name = created.name,
            description = created.description,
            price = created.price
        )

        return CreateProductResponse.newBuilder()
            .setProduct(productDto)
            .build()
    }

    override suspend fun fetchProduct(request: FetchProductRequest): FetchProductResponse {
        val product = fetchProductQuery.fetch(
            FetchProductQuery.In(
                id = request.id
            )
        )

        val productDto = buildProductResponseDto(
            id = product.name,
            name = product.name,
            description = product.description,
            price = product.price
        )

        return FetchProductResponse.newBuilder()
            .setProduct(productDto)
            .build()
    }

    override suspend fun fetchAll(request: Empty): FetchAllProductsResponse {
        val products = fetchAllProductsQuery.fetchAll()

        val productDtoList = products.map {
            buildProductResponseDto(
                id = it.name,
                name = it.name,
                description = it.description,
                price = it.price
            )
        }

        return FetchAllProductsResponse.newBuilder()
            .addAllProducts(productDtoList)
            .build()
    }
}