pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}

plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}

dependencyResolutionManagement {
    repositories {
        mavenCentral()
    }
}

rootProject.name = "market"

include(
    "inventory",
    "inventory-service",
    "order",
    "order-service",
    "product",
    "product-service",
    "common",
    "client-redis",
    "inventory-event",
    "user",
    "identification",
    "auth",
    "client-ses",
    "user-api-gateway",
)