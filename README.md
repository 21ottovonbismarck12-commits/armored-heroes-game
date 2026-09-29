# Armored Heroes Online

Plataforma web de combate blindado con autenticación, progresión, equipamiento y multijugador base. Incluye el juego Canvas **Tank Commander** como módulo jugable integrado.

## Características

- **Frontend React + Vite** con login, registro y lobby.
- **Servidor Node.js + Express + Socket.io**.
- **Persistencia MongoDB** para usuarios, jugadores, inventario y registros de combate.
- **Combate por turnos** con recompensas y generación de objetos.
- **Tank Commander integrado** en `client/public/tank-commander.html`, cargado desde `GameCanvas.jsx`.
- **Recursos del juego** en `client/public/`, incluida la imagen `loco.jpg`.

## Estructura

```text
armored-heroes-game/
├── client/
│   ├── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── GameCanvas.jsx       # módulo Tank Commander
│   │   └── main.jsx
│   └── public/
│       ├── tank-commander.html
│       └── loco.jpg
├── server/
│   └── src/
├── INTEGRATION.md
└── package.json
```

## Instalación

Requisitos: Node.js 18+, npm y MongoDB local o Atlas.

```bash
npm run install:all
cp server/.env.example server/.env
# Edita server/.env con MONGODB_URI y JWT_SECRET
npm run dev
```

El cliente se sirve con Vite y el servidor escucha normalmente en el puerto `3001`. Para producción:

```bash
npm run build
npm start
```

## Integración

La integración es modular: React gestiona la cuenta y el lobby, mientras que el juego Canvas conserva su ciclo de renderizado y se muestra dentro de un iframe. Esto evita mezclar de forma insegura el estado de React con el estado interno del juego. Consulta [INTEGRATION.md](./INTEGRATION.md) para conocer la decisión y una posible evolución con `postMessage`.

## Validación realizada

- `npm run build` pasa para cliente y servidor.
- Todos los imports locales existen.
- El motor de combate fue probado con una simulación real.
- La dependencia inválida `jsonwebtoken@^9.1.1` se corrigió a `^9.0.3`.

## Licencia

MIT
