# Guía de Desarrollo - Armored Heroes Online

## Configuración Inicial

### 1. Requisitos
- Node.js 18+
- npm o yarn
- MongoDB (local o usando Docker)
- Git

### 2. Clonar y Instalar

```bash
git clone https://github.com/21ottovonbismarck12-commits/armored-heroes-game.git
cd armored-heroes-game

# Instalar todas las dependencias
npm run install:all
```

### 3. Variables de Entorno

**Server** - Crear `server/.env`:
```
PORT=3001
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/armored-heroes
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

**Client** - Crear `client/.env`:
```
VITE_SERVER_URL=http://localhost:3001
```

### 4. Ejecutar en Desarrollo

```bash
# Opción 1: Ejecutar ambos servidores a la vez
npm run dev

# Opción 2: Ejecutar por separado
npm run dev:client   # Terminal 1
npm run dev:server   # Terminal 2
```

- **Client**: http://localhost:5173
- **Server**: http://localhost:3001

## Estructura del Proyecto

```
armored-heroes-game/
├── client/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── main.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── src/
│   │   ├── models/           # Modelos de MongoDB
│   │   ├── routes/           # Rutas de API
│   │   ├── controllers/      # Controladores
│   │   ├── services/         # Lógica de negocio
│   │   └── index.js          # Punto de entrada
│   ├── .env.example
│   └── package.json
├── shared/                   # Código compartido
├── docker-compose.yml
├── README.md
└── DEVELOPMENT.md
```

## Tecnologías Principales

### Frontend
- **React 18** - UI
- **Phaser 3** - Motor de juegos 2D
- **Socket.io Client** - Comunicación en tiempo real
- **Vite** - Build tool
- **CSS3** - Estilos

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **Socket.io** - WebSockets
- **MongoDB** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas

## Próximos Pasos de Desarrollo

### Fase 1: Autenticación
- [ ] Crear sistema de login/registro
- [ ] Implementar JWT
- [ ] Proteger rutas

### Fase 2: Modelos de Datos
- [ ] Modelo de Usuario
- [ ] Modelo de Jugador
- [ ] Modelo de Equipo
- [ ] Modelo de Inventario
- [ ] Modelo de Combate

### Fase 3: Sistema de Combate
- [ ] Lógica de turnos
- [ ] Cálculo de daño
- [ ] Sistema de habilidades

### Fase 4: Equipamiento y Gacha
- [ ] Sistema de rareza
- [ ] Generación de objetos
- [ ] Sistema de gacha

### Fase 5: Multijugador
- [ ] Salas de combate
- [ ] Matchmaking
- [ ] Sincronización de estados

## Scripts Útiles

```bash
# Desarrollo
npm run dev              # Ambos servidores
npm run dev:client      # Solo cliente
npm run dev:server      # Solo servidor

# Build
npm run build           # Build completo
npm run build:client    # Build cliente
npm run build:server    # Build servidor

# Producción
npm start               # Iniciar servidor

# Instalar dependencias
npm run install:all     # Instalar en todos los proyectos
```

## Docker

```bash
# Buildear imagen
docker-compose build

# Ejecutar
docker-compose up

# Detener
docker-compose down
```

## Debugging

### Frontend
- Usar DevTools del navegador (F12)
- Verificar consola de errores
- Network tab para ver WebSocket

### Backend
- Logs en consola
- Verificar conexión a MongoDB
- Comprobar puerto 3001

## Convenciones de Código

### Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: cambios de estilo
refactor: refactorización
test: tests
chore: tareas de mantenimiento
```

### Estructura de Componentes React
```jsx
import { useState } from 'react';
import './Component.css';

function Component({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  return (
    <div className="component">
      {/* contenido */}
    </div>
  );
}

export default Component;
```

## Recursos Útiles

- [Documentación de Phaser 3](https://phaser.io/docs/3.55.2)
- [Socket.io Documentation](https://socket.io/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## Ayuda

Para reportar bugs o sugerencias, abre un issue en el repositorio.
