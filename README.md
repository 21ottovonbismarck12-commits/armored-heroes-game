
## Prototipo 3D modular

La rama principal incluye una primera arena 3D experimental con Babylon.js. Se puede probar sin backend mediante:

```bash
npm run dev --prefix client
# abrir http://localhost:5173/?demo=3d
```

El prototipo incluye un tanque construido por piezas separadas: chasis, orugas, torreta y cañón. Usa `WASD` para mover, las flechas izquierda/derecha para girar la torreta y la rueda del mouse para controlar la cámara. El panel **GARAGE MODULAR** permite cambiar las piezas durante la partida y recalcula vida, blindaje, velocidad y daño.

El modelo actual es procedural para validar la mecánica y los puntos de montaje. Los modelos GLB de CGTrader o Sketchfab pueden sustituirse después respetando el mismo contrato de piezas. Los assets extraídos de videojuegos comerciales no deben incorporarse sin autorización de sus titulares.

Para una demostración visual sin login se utiliza `?demo=3d`; el acceso normal sigue pasando por autenticación y el modo clásico 2D permanece disponible desde el botón **Modo clásico 2D**.
