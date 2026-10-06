# Arquitectura del prototipo 3D

```text
client/src/
├── components/
│   ├── GameCanvas.jsx       # marco React y HUD del modo 3D/2D
│   └── GameCanvas.css
└── game3d/
    ├── scene.js             # Babylon Engine, cámara, luces y arena
    ├── modularTank.js       # piezas, anclajes, estadísticas y disparo
    └── materials.js         # materiales PBR y estilo del teatro
```

Babylon owns the scene graph and meshes. React owns the mode switch, selected parts and textual HUD. The loadout is plain JSON and can be sent through Socket.io later.

Cada pieza es un `TransformNode` independiente:

- `hull`: chasis y blindaje base.
- `tracks`: movilidad y orugas.
- `turret`: giro horizontal.
- `gun`: elevación y cañón.

Los assets reales GLB se pueden sustituir después dentro de `modularTank.js` sin cambiar el contrato del loadout.
