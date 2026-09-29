import { useEffect, useRef } from 'react';
import './GameCanvas.css';

function GameCanvas({ player, socket }) {
  const frameRef = useRef(null);
  const gameUrl = `/tank-commander.html?online=1&name=${encodeURIComponent(player?.characterName || 'Jugador')}`;

  useEffect(() => {
    if (!socket) return undefined;

    const sendToGame = (message) => {
      frameRef.current?.contentWindow?.postMessage(
        { source: 'armored-heroes', ...message },
        window.location.origin,
      );
    };
    const onSnapshot = (players) => sendToGame({ type: 'world:snapshot', players });
    const onJoined = (payload) => sendToGame({ type: 'player:joined', player: payload.player });
    const onState = (payload) => sendToGame({ type: 'player:state', player: payload.player });
    const onLeft = (payload) => sendToGame({ type: 'player:left', playerId: payload.playerId });
    const onConnect = () => sendToGame({ type: 'identity', playerId: socket.id });
    const onMessage = (event) => {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.source !== 'tank-commander') return;
      if (event.data.type === 'state') socket.emit('player:state', event.data.state);
    };

    socket.on('world:snapshot', onSnapshot);
    socket.on('player:joined', onJoined);
    socket.on('player:state', onState);
    socket.on('player:left', onLeft);
    socket.on('connect', onConnect);
    window.addEventListener('message', onMessage);
    if (socket.connected) onConnect();
    socket.emit('player:requestSnapshot');

    return () => {
      socket.off('world:snapshot', onSnapshot);
      socket.off('player:joined', onJoined);
      socket.off('player:state', onState);
      socket.off('player:left', onLeft);
      socket.off('connect', onConnect);
      window.removeEventListener('message', onMessage);
    };
  }, [socket]);

  const handleFrameLoad = () => {
    if (socket?.id) frameRef.current?.contentWindow?.postMessage(
      { source: 'armored-heroes', type: 'identity', playerId: socket.id },
      window.location.origin,
    );
    socket?.emit('player:requestSnapshot');
  };

  return (
    <section className="game-module" aria-label="Tank Commander online integrado">
      <div className="game-module-toolbar">
        <span>Tank Commander Online · comandante: {player?.characterName || 'Jugador'}</span>
        <span className="game-module-hint">Posición, torreta y vida sincronizadas por Socket.io</span>
      </div>
      <iframe
        ref={frameRef}
        className="game-module-frame"
        title="Tank Commander Online"
        src={gameUrl}
        onLoad={handleFrameLoad}
        allow="fullscreen"
      />
    </section>
  );
}

export default GameCanvas;
