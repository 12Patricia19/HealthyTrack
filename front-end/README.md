# HealthyTrack Mobile App

Aplicación móvil Android desarrollada con React Native y Expo para el seguimiento de hábitos saludables.

## Características

- ✅ Gestión de usuarios
- ✅ Registro de hábitos diarios (agua, actividad física, comida, sueño, mindfulness)
- ✅ Notas de hábitos
- ✅ Interfaz intuitiva con navegación por pestañas
- ✅ Integración completa con API backend

## Tecnologías

- React Native 0.73
- Expo ~50.0
- React Navigation 6
- Axios para peticiones HTTP
- React Native Picker para selección de datos

## Requisitos Previos

- Node.js 16+ 
- npm o yarn
- Expo CLI: `npm install -g expo-cli`
- Para Android: Android Studio o emulador Android
- Para iOS: Xcode (solo en macOS)

## Instalación

1. Instalar dependencias:
```bash
npm install
```

## Configuración del Backend

Asegúrate de que el backend de HealthyTrack esté corriendo en el puerto 8080.

### Configurar la URL del API

La aplicación usa `10.0.2.2:8080` por defecto para emuladores Android.

Para modificar la URL del API, edita el archivo `app.json`:

```json
"extra": {
  "apiUrl": "http://TU_IP:8080/api"
}
```

**Opciones de URL según el entorno:**
- Emulador Android: `http://10.0.2.2:8080/api`
- Simulador iOS: `http://localhost:8080/api`
- Dispositivo físico: `http://TU_IP_LOCAL:8080/api` (ejemplo: `http://192.168.1.10:8080/api`)

Para obtener tu IP local:
- macOS/Linux: `ifconfig | grep inet`
- Windows: `ipconfig`

## Ejecución

### Iniciar en modo desarrollo
```bash
npm start
```

### Ejecutar en Android
```bash
npm run android
```

### Ejecutar en iOS (solo macOS)
```bash
npm run ios
```

### Escanear código QR con Expo Go

1. Instala Expo Go en tu dispositivo móvil:
   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Ejecuta `npm start`
3. Escanea el código QR con:
   - Android: Expo Go app
   - iOS: Cámara nativa del iPhone

## Estructura del Proyecto

```
front-end/
├── App.js                 # Punto de entrada
├── app.json              # Configuración de Expo
├── babel.config.js       # Configuración de Babel
├── package.json          # Dependencias
└── src/
    ├── App.jsx          # Componente principal con navegación
    ├── components/      # Componentes de la aplicación
    │   ├── Users.jsx           # Gestión de usuarios
    │   ├── DailyHabits.jsx     # Registro de hábitos
    │   └── HabitNotes.jsx      # Notas de hábitos
    └── services/        # Servicios de API
        ├── api.js              # Configuración de Axios
        ├── userService.js      # Servicios de usuarios
        ├── dailyHabitService.js # Servicios de hábitos
        └── habitNoteService.js  # Servicios de notas
```


### Expo no inicia

```bash
# Limpiar caché de Expo
expo start -c
```

### Problemas con dependencias

```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules
npm install
```

## Build para Producción

### Android APK

```bash
# Build de desarrollo
eas build --profile development --platform android

# Build de producción
eas build --profile production --platform android
```

