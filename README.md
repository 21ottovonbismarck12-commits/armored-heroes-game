
## Prototipo 3D modular

La rama principal incluye una primera arena 3D experimental con Babylon.js. Se puede probar sin backend mediante:

```bash
npm run dev --prefix client
# abrir http://localhost:5173/?demo=3d
```

El prototipo incluye un tanque construido por piezas separadas: chasis, orugas, torreta y cañón. Usa `WASD` para mover, las flechas izquierda/derecha para girar la torreta y la rueda del mouse para controlar la cámara. El panel **GARAGE MODULAR** permite cambiar las piezas durante la partida y recalcula vida, blindaje, velocidad y daño.

La arena ahora muestra dos modelos descargados de CGTrader como vehículos de ambientación: **A34 Comet** y **M4A2 Sherman** (`client/public/assets/tanks/*.glb`). El tanque del jugador sigue siendo procedural para conservar el sistema de piezas intercambiables: chasis, orugas, torreta y cañón. Los modelos de CGTrader se mantienen separados hasta preparar una segmentación fiable de sus piezas y respetar las condiciones de atribución de cada autor. Los assets extraídos de videojuegos comerciales no deben incorporarse sin autorización de sus titulares.

Para una demostración visual sin login se utiliza `?demo=3d`; el acceso normal sigue pasando por autenticación y el modo clásico 2D permanece disponible desde el botón **Modo clásico 2D**.
