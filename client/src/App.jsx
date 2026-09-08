import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import authService from './services/authService';
import Login from './components/Login';
import Register from './components/Register';
import GameCanvas from './components/GameCanvas';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [player, setPlayer] = useState(null);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' o 'register'

  useEffect(() => {
    // Verificar si hay sesión guardada
    if (authService.isAuthenticated()) {
      const savedUser = authService.getCurrentUser();
      const savedPlayer = authService.getCurrentPlayer();
      setUser(savedUser);
      setPlayer(savedPlayer);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001');

    newSocket.on('connect', () => {
      console.log('✅ Conectado al servidor');
      setIsConnected(true);
    });

    newSocket.on('game:ready', () => {
      console.log('🎮 Juego listo');
      setGameStarted(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Desconectado del servidor');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  const handleLoginSuccess = (userData, playerData) => {
    setUser(userData);
    setPlayer(playerData);
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = (userData, playerData) => {
    setUser(userData);
    setPlayer(playerData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setPlayer(null);
    setIsAuthenticated(false);
    setGameStarted(false);
    if (socket) {
      socket.disconnect();
    }
  };

  const handleStartGame = () => {
    if (socket && isConnected) {
      socket.emit('player:join', { 
        name: player?.characterName,
        level: player?.level 
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>⚔️ Armored Heroes Online</h1>
        </header>
        {authMode === 'login' ? (
          <Login 
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setAuthMode('register')}
          />
        ) : (
          <Register 
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚔️ Armored Heroes Online</h1>
        <div className="header-right">
          <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </span>
          <span className="user-info">👤 {user?.username}</span>
          <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </header>

      <main className="app-main">
        {!gameStarted ? (
          <div className="welcome-screen">
            <div className="welcome-card">
              <h2>¡Bienvenido, {player?.characterName}!</h2>
              <div className="player-stats">
                <div className="stat">
                  <span>Nivel:</span>
                  <strong>{player?.level || 1}</strong>
                </div>
                <div className="stat">
                  <span>Experiencia:</span>
                  <strong>{player?.experience || 0}/100</strong>
                </div>
              </div>
              <button 
                className="btn-play"
                onClick={handleStartGame}
                disabled={!isConnected}
              >
                {isConnected ? '🎮 Iniciar Juego' : '⏳ Conectando...'}
              </button>
            </div>
          </div>
        ) : (
          <GameCanvas player={player} socket={socket} />
        )}
      </main>
    </div>
  );
}

export default App;
