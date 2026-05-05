plugins {
    kotlin("jvm")
}

dependencies {
    implementation(project(":inventory"))

    runtimeOnly("com.h2database:h2")
}