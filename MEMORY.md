# Memoria

- El proyecto existente es React + Vite con un módulo Canvas 2D integrado.
- El prototipo 3D se añade como modo experimental y conserva Tank Commander 2D.
- Babylon se usa con imports profundos para mantener el bundle razonable.
- Las piezas del tanque son meshes procedurales intercambiables; se pueden reemplazar por GLB con los mismos anchors.
- La conexión Socket.io actual sincroniza jugadores 2D; todavía no sincroniza el loadout 3D.
