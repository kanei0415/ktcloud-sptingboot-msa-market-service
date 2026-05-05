plugins {
    kotlin("jvm")
}

object Versions {
    const val JWT = "0.12.6"
}

dependencies {
    implementation(project(":user"))
    implementation(project(":common"))
    implementation(project(":client-redis"))
    implementation(project(":identification"))
    implementation(project(":client-ses"))

    implementation("org.springframework.boot:spring-boot-starter-security")

    implementation("io.jsonwebtoken:jjwt-api:${Versions.JWT}")

    runtimeOnly("io.jsonwebtoken:jjwt-impl:${Versions.JWT}")

    runtimeOnly("io.jsonwebtoken:jjwt-jackson:${Versions.JWT}")


}