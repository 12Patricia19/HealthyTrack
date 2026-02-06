# HealthyTrack Frontend

Simple React frontend for HealthyTrack.

## Requirements
- Node.js 18+
- Backend running at http://localhost:8080

## Development
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Build
```bash
npm run build
npm run preview
```

## Docker
```bash
docker build -t healthytrack-frontend .
docker run -p 80:80 healthytrack-frontend
```

## Environment
Create .env:
```env
VITE_API_URL=http://localhost:8080/api
```
