# Integración de proyectos

## Decisión

Los proyectos no comparten la misma arquitectura: `armored-heroes-game` es React + Vite + Express/Socket.io/MongoDB, mientras que `tank-commander.html` es un juego Canvas autocontenido. Una mezcla directa habría duplicado entradas, ciclo de renderizado y estado de autenticación.

La integración elegida es modular y reversible:

- React sigue siendo la aplicación principal.
- `client/public/tank-commander.html` conserva el juego Canvas completo.
- `GameCanvas.jsx` lo carga dentro de un `iframe`, desde `/tank-commander.html`.
- `client/public/loco.jpg` queda disponible para la interfaz del juego.
- La sesión autenticada y el lobby online permanecen en React/Socket.io.

## Desarrollo

```bash
npm run install:all
npm run dev
```

El cliente usa Vite y el servidor usa Express/Socket.io. Para autenticación real hay que configurar `server/.env` a partir de `server/.env.example`, incluyendo `MONGODB_URI`, `JWT_SECRET` y `CLIENT_URL`.

## Producción

```bash
npm run build
```

El build del cliente incluye el iframe y sus recursos estáticos. La integración puede reemplazarse más adelante por un componente Phaser o por mensajes `postMessage` si se desea sincronizar progreso del Canvas con el perfil online.
