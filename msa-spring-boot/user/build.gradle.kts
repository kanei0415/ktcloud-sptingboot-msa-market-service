plugins {
    kotlin("jvm")
    kotlin("kapt")
}

dependencies {
    implementation(project(":common"))
    implementation(project(":identification"))

    implementation("org.springframework.boot:spring-boot-starter-data-jpa")

    implementation("org.springframework.boot:spring-boot-starter-security")
}