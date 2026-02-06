# 🏃‍♂️ HealthyTrack

Sistema de seguimiento de hábitos saludables con backend en **Kotlin + Spring Boot** y app móvil en **React Native + Expo**.

---

## 📋 Requisitos

### Backend:
- Docker y Docker Compose

### Frontend (App Móvil):
- Node.js 16+
- Expo Go en tu celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

---

## 🚀 Instalación

### 1. Instalar dependencias del frontend

```bash
cd front-end
npm install
```

### 2. Configurar URL del API

Edita `front-end/app.json`:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://10.0.2.2:8080/api"  // Para emulador Android
    }
  }
}
```

**Si usas dispositivo físico**, cambia a tu IP local:
```bash
# Obtener tu IP
ifconfig | grep "inet "  # macOS/Linux
ipconfig                 # Windows

# Luego usa: "http://TU_IP:8080/api"
```

---

## ▶️ Ejecutar el Proyecto

### Paso 1: Levantar el backend

Desde la raíz del proyecto:

```bash
docker-compose up -d
```

Verificar que funcione:
```bash
curl http://localhost:8080/api/users
# Debe retornar []
```

### Paso 2: Levantar la app móvil

```bash
cd front-end
npm start
```

### Paso 3: Abrir en tu celular

1. Abre **Expo Go** en tu celular
2. Escanea el código QR que aparece
3. ¡Listo!

**Alternativa con emulador Android:**
```bash
npm run android
```

---

## 🛠️ Comandos Útiles

### Backend (Docker)

```bash
# Ver logs
docker-compose logs -f

# Reiniciar
docker-compose restart

# Detener
docker-compose down

# Reconstruir
docker-compose up --build
```

### Frontend (Expo)

```bash
# Iniciar con caché limpia
npm start -- --clear

# Usar emulador Android
npm run android

# Usar simulador iOS (solo macOS)
npm run ios
```

---