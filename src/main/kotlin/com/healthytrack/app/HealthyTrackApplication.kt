package com.healthytrack.app

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class HealthyTrackApplication

fun main(args: Array<String>) {
    runApplication<HealthyTrackApplication>(*args)
}
