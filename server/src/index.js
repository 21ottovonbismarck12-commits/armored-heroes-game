import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';

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

// Conectar a MongoDB
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// WebSocket eventos
const players = new Map();

io.on('connection', (socket) => {
  console.log(`🎮 Jugador conectado: ${socket.id}`);

  socket.on('player:join', (playerData) => {
    console.log(`✅ Jugador ${playerData.name} se unió (${socket.id})`);
    players.set(socket.id, { ...playerData, socketId: socket.id });
    
    // Notificar a todos los clientes que un nuevo jugador se unió
    io.emit('player:joined', { 
      playerId: socket.id, 
      player: playerData,
      totalPlayers: players.size 
    });
    
    socket.emit('game:ready');
  });

  socket.on('disconnect', () => {
    console.log(`❌ Jugador desconectado: ${socket.id}`);
    players.delete(socket.id);
    io.emit('player:left', { 
      playerId: socket.id,
      totalPlayers: players.size 
    });
  });

  socket.on('error', (error) => {
    console.error(`⚠️ Error de socket: ${error}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`\n🎮 ===================================`);
  console.log(`🎮 Servidor iniciado en puerto ${PORT}`);
  console.log(`📡 WebSocket activo en ws://localhost:${PORT}`);
  console.log(`🎮 ===================================\n`);
});

export { app, io };
