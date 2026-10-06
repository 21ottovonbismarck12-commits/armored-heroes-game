import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import authService from './services/authService';
import Login from './components/Login';
import Register from './components/Register';
import GameCanvas from './components/GameCanvas';
import './App.css';

function App() {
  const demo3d = new URLSearchParams(window.location.search).get('demo') === '3d';
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(demo3d);
  const [isAuthenticated, setIsAuthenticated] = useState(demo3d);
  const [player, setPlayer] = useState(demo3d ? { characterName: 'Comandante Demo', level: 1, experience: 0 } : null);
  const [user, setUser] = useState(demo3d ? { username: 'demo' } : null);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    if (demo3d) return undefined;
    if (authService.isAuthenticated()) {
      setUser(authService.getCurrentUser());
      setPlayer(authService.getCurrentPlayer());
      setIsAuthenticated(true);
    }
    return undefined;
  }, [demo3d]);

  useEffect(() => {
    if (!isAuthenticated || demo3d) return undefined;
    const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001');
    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('game:ready', () => setGameStarted(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [isAuthenticated, demo3d]);

  const handleAuthSuccess = (userData, playerData) => {
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
    socket?.disconnect();
  };

  const handleStartGame = () => {
    if (socket && isConnected) socket.emit('player:join', { name: player?.characterName, level: player?.level });
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <header className="app-header"><h1>⚔️ Armored Heroes Online</h1></header>
        {authMode === 'login' ? (
          <Login onLoginSuccess={handleAuthSuccess} onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <Register onRegisterSuccess={handleAuthSuccess} onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>⚔️ Armored Heroes Online</h1>
        <div className="header-right">
          <span className={`status ${demo3d ? 'connected' : isConnected ? 'connected' : 'disconnected'}`}>
            {demo3d ? '🟡 Demo 3D' : isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
          </span>
          <span className="user-info">👤 {user?.username}</span>
          {!demo3d && <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>}
        </div>
      </header>
      <main className="app-main">
        {!gameStarted ? (
          <div className="welcome-screen"><div className="welcome-card">
            <h2>¡Bienvenido, {player?.characterName}!</h2>
            <div className="player-stats"><div className="stat"><span>Nivel:</span><strong>{player?.level || 1}</strong></div><div className="stat"><span>Experiencia:</span><strong>{player?.experience || 0}/100</strong></div></div>
            <button className="btn-play" onClick={handleStartGame} disabled={!isConnected}>{isConnected ? '🎮 Iniciar Juego' : '⏳ Conectando...'}</button>
          </div></div>
        ) : <GameCanvas player={player} socket={socket} />}
      </main>
    </div>
  );
}

export default App;
