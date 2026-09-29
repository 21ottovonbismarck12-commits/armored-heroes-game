
## Modo online implementado

El módulo Canvas se conecta con la sesión Socket.io mediante `postMessage`:

- React envía al iframe la identidad y los eventos `world:snapshot`, `player:joined`, `player:state` y `player:left`.
- El iframe envía cada pocos frames su posición, dirección, ángulo de torreta, vida y nivel.
- El servidor valida límites numéricos y retransmite el estado a los demás sockets.
- Los aliados remotos aparecen en el campo de batalla con su nombre y vida.

Esta primera fase sincroniza movimiento y estado visual. El combate autoritativo online —disparos, colisiones, daño, recompensas y persistencia— debe implementarse después en el servidor para evitar trampas y divergencias entre clientes.

## Pasos para ejecutarlo online

1. Crear una base MongoDB Atlas y copiar su URI.
2. En el servidor:

   ```bash
   cp server/.env.example server/.env
   ```

3. Editar `server/.env`:

   ```env
   PORT=3001
   CLIENT_URL=https://TU-DOMINIO-FRONTEND
   MONGODB_URI=mongodb+srv://USUARIO:CONTRASEÑA@CLUSTER/armored-heroes
   JWT_SECRET=una-clave-larga-y-aleatoria
   NODE_ENV=production
   ```

4. Publicar el cliente en Vercel, Netlify o un servidor estático.
5. Publicar el servidor Node en Render, Railway, Fly.io o una VM con WebSocket habilitado.
6. Configurar `VITE_SERVER_URL=https://TU-DOMINIO-SERVIDOR` al compilar el cliente:

   ```bash
   VITE_SERVER_URL=https://TU-DOMINIO-SERVIDOR npm run build:client
   ```

7. Probar:

   ```bash
   curl https://TU-DOMINIO-SERVIDOR/api/health
   ```

   Después, abrir dos navegadores, registrar dos usuarios y entrar a la misión. Ambos tanques deberían verse y moverse en el mismo mundo.
