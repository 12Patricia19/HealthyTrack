package com.healthytrack.app.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

@Configuration
class CorsConfig {

    @Bean
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()
        
        // Permitir credenciales
        config.allowCredentials = true
        
        // Orígenes permitidos
        config.allowedOrigins = listOf(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:80",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173"
        )
        
        // Headers permitidos
        config.allowedHeaders = listOf("*")
        
        // Métodos HTTP permitidos
        config.allowedMethods = listOf(
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "PATCH",
            "OPTIONS"
        )
        
        // Headers expuestos
        config.exposedHeaders = listOf(
            "Authorization",
            "Content-Type",
            "X-Total-Count"
        )
        
        // Tiempo de caché para preflight requests
        config.maxAge = 3600L
        
        source.registerCorsConfiguration("/**", config)
        return CorsFilter(source)
    }
}
