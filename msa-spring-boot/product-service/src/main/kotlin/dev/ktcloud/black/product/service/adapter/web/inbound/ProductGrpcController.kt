package dev.ktcloud.black.product.service.adapter.web.inbound

import dev.ktcloud.black.product.service.adapter.presentation.web.inbound.grpc.CreateProductRequest
import dev.ktcloud.black.product.service.adapter.presentation.web.inbound.grpc.CreateProductResponse
import dev.ktcloud.black.product.service.adapter.presentation.web.inbound.grpc.Empty
import dev.ktcloud.black.product.service.adapter.presentation.web.inbound.grpc.FetchAllProductsResponse
import dev.ktcloud.black.product.service.adapter.presentation.web.inbound.grpc.FetchProductRequest
import dev.ktcloud.black.product.service.adapter.presentation.web.inbound.grpc.FetchProductResponse
import dev.ktcloud.black.product.service.adapter.presentation.web.inbound.grpc.ProductServiceGrpcKt

abstract class ProductGrpcController: ProductServiceGrpcKt.ProductServiceCoroutineImplBase() {
    abstract override suspend fun createProduct(request: CreateProductRequest): CreateProductResponse

    abstract override suspend fun fetchProduct(request: FetchProductRequest): FetchProductResponse

    abstract override suspend fun fetchAll(request: Empty): FetchAllProductsResponse
}