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
    const state = {
      playerId: socket.id,
      name: String(playerData.name || 'Jugador').slice(0, 32),
      level: Number(playerData.level) || 1,
      x: 120,
      turretAngle: 0.15,
      facing: 1,
      hp: 100,
      maxHp: 100,
      campaign: 1,
      subLevel: 1,
      socketId: socket.id
    };
    players.set(socket.id, state);

    socket.emit('world:snapshot', Array.from(players.values()));
    
    // Notificar a todos los clientes que un nuevo jugador se unió
    socket.broadcast.emit('player:joined', { player: state, totalPlayers: players.size });
    
    socket.emit('game:ready');
  });

  socket.on('player:requestSnapshot', () => {
    socket.emit('world:snapshot', Array.from(players.values()));
  });

  socket.on('player:state', (incoming) => {
    const current = players.get(socket.id);
    if (!current || !incoming || typeof incoming !== 'object') return;
    const number = (value, fallback, min, max) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? Math.max(min, Math.min(max, parsed)) : fallback;
    };
    current.x = number(incoming.x, current.x, 0, 100000);
    current.turretAngle = number(incoming.turretAngle, current.turretAngle, -2, 2);
    current.facing = Number(incoming.facing) < 0 ? -1 : 1;
    current.hp = number(incoming.hp, current.hp, 0, Math.max(current.maxHp, 1));
    current.maxHp = number(incoming.maxHp, current.maxHp, 1, 100000);
    current.campaign = number(incoming.campaign, current.campaign, 1, 99);
    current.subLevel = number(incoming.subLevel, current.subLevel, 1, 99);
    socket.broadcast.emit('player:state', { player: current });
  });

  socket.on('player:loadout', (payload) => {
    const current = players.get(socket.id);
    const loadout = payload?.loadout;
    if (!current || !loadout || typeof loadout !== 'object') return;
    const allowed = {
      hull: ['panzer3', 't34', 'is2'],
      tracks: ['bt5', 'panzer4', 't34'],
      turret: ['panzer4', 't34', 'stug'],
      gun: ['stuart37', 'panzer50', 'is2_122']
    };
    const clean = {};
    for (const [slot, choices] of Object.entries(allowed)) {
      if (choices.includes(loadout[slot])) clean[slot] = loadout[slot];
    }
    current.loadout = { ...(current.loadout || {}), ...clean };
    socket.broadcast.emit('player:loadout', { playerId: socket.id, loadout: current.loadout });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Jugador desconectado: ${socket.id}`);
    players.delete(socket.id);
    socket.broadcast.emit('player:left', {
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
