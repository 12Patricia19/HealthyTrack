
# HealthyTrack

## Levantamiento de la base de datos con Docker Compose

Para inicializar la base de datos, se requiere tener Docker y Docker Compose instalados en el sistema. Desde la raíz del proyecto, se debe ejecutar el siguiente comando:

```bash
docker-compose up -d
```

Este comando crea y ejecuta un contenedor de PostgreSQL en el puerto 5432, utilizando las credenciales definidas en los archivos `docker-compose.yml` y `application.properties`.

## Ejecución de la aplicación

El siguiente comando inicia la aplicación:

```bash
./gradlew bootRun
```

Una vez iniciada, la aplicación estará disponible en [http://localhost:8080](http://localhost:8080).

## Ejecución de pruebas

Las pruebas unitarias y de integración pueden ejecutarse mediante el siguiente comando:

```bash
./gradlew test
```

## Visualización del reporte de cobertura

Para generar y visualizar el reporte de cobertura de pruebas, se debe ejecutar:

```bash
./gradlew jacocoTestReport
```

El reporte HTML se genera en la ruta `build/reports/jacoco/test/html/index.html`.