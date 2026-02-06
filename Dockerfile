# Dockerfile para el Backend de HealthyTrack (Kotlin + Spring Boot)

# Stage 1: Build
FROM gradle:8.5-jdk17 AS build

WORKDIR /app

# Copiar archivos de Gradle primero para aprovechar el caché de Docker
COPY build.gradle.kts settings.gradle.kts gradle.properties ./

# Descargar dependencias (se cachea si no cambian)
RUN gradle dependencies --no-daemon || true

# Copiar código fuente
COPY src ./src

# Construir la aplicación
RUN gradle build -x test --no-daemon

# Stage 2: Run
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copiar el JAR construido desde la etapa anterior
COPY --from=build /app/build/libs/*.jar app.jar

# Exponer el puerto
EXPOSE 8080

# Variables de entorno (se pueden sobrescribir en docker-compose)
ENV SPRING_PROFILES_ACTIVE=prod

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
