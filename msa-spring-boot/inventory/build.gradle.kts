plugins {
    kotlin("jvm")
    kotlin("plugin.jpa")
}

dependencies {
    implementation(project(":common"))
    implementation(project(":client-redis"))
    implementation(project(":inventory-event"))

    implementation("org.springframework.boot:spring-boot-starter-web")

    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core")

    implementation("org.springframework.boot:spring-boot-starter-data-jpa")

    implementation("org.springframework.kafka:spring-kafka")

    runtimeOnly("com.h2database:h2")
}