# Armored Heroes Online

Un juego multiplayer online similar a "Armored Heroes" con sistema de progresión, equipamiento, mejoras y gacha.

## Características

- 🎮 **Multijugador en línea** - Combate en tiempo real con otros jugadores
- ⚔️ **Sistema de combate por turnos** - Estrategia y tácticas
- 🛡️ **Equipamiento y mejoras** - Diferentes armaduras, armas y accesorios
- 📈 **Sistema de progresión** - Niveles, experiencia y estadísticas
- 🎰 **Sistema Gacha** - Obtén equipamiento raro de forma aleatoria
- 📱 **Multiplataforma** - Web (navegador) y potencial para móvil

## Tecnología

- **Frontend**: React + TypeScript + Phaser 3 (motor de juegos)
- **Backend**: Node.js + Express + Socket.io (multiplayer)
- **Base de datos**: MongoDB
- **Deployment**: Docker + Vercel/Heroku

## Estructura del Proyecto

```
armored-heroes-game/
├── client/              # Frontend (React + Phaser)
├── server/              # Backend (Node.js)
├── shared/              # Código compartido
├── docker-compose.yml
└── package.json
```

## Instalación

### Requisitos
- Node.js 18+
- npm o yarn
- MongoDB (local o Atlas)

### Setup local

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## Roadmap

- [ ] Estructura base frontend/backend
- [ ] Sistema de autenticación
- [ ] Interfaz del jugador
- [ ] Motor de combate
- [ ] Sistema de equipamiento
- [ ] Sistema Gacha
- [ ] Multijugador
- [ ] Persistencia de datos
- [ ] Leaderboards

## Licencia

MIT
