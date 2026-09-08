import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// WebSocket eventos
io.on('connection', (socket) => {
  console.log(`Jugador conectado: ${socket.id}`);

  socket.on('player:join', (playerData) => {
    console.log(`Jugador ${playerData.name} se unió`);
    socket.emit('game:ready');
  });

  socket.on('disconnect', () => {
    console.log(`Jugador desconectado: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🎮 Servidor iniciado en puerto ${PORT}`);
  console.log(`📡 WebSocket activo en ws://localhost:${PORT}`);
});
