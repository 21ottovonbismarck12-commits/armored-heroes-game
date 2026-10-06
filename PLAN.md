# Prototipo 3D modular de Armored Heroes

## Objetivo

Crear una arena 3D jugable en navegador que demuestre un tanque compuesto por chasis, orugas, torreta y cañón intercambiables, sin romper el modo 2D existente.

## Riesgos aislados

1. **Render 3D en React:** inicialización y desmontaje seguro de Babylon.
2. **Tanque modular:** cada pieza debe ser un nodo independiente y cambiarse en tiempo real.
3. **Cámara y controles:** tercera persona, teclado y rotación de torreta.
4. **Base online futura:** mantener el estado del loadout serializable para Socket.io.

## Criterios de verificación

- La escena muestra terreno, ruinas, iluminación, tanque modular y HUD.
- Las piezas cambian desde el panel de garage.
- WASD mueve el tanque; flechas izquierda/derecha giran la torreta; espacio dispara.
- El build de Vite pasa y no hay errores de sintaxis.
- El modo 2D sigue disponible como respaldo.
