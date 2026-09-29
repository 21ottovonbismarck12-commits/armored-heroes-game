import './GameCanvas.css';

function GameCanvas({ player }) {
  return (
    <section className="game-module" aria-label="Tank Commander integrado">
      <div className="game-module-toolbar">
        <span>Tank Commander · comandante: {player?.characterName || 'Jugador'}</span>
        <span className="game-module-hint">El juego se ejecuta dentro de Armored Heroes Online</span>
      </div>
      <iframe
        className="game-module-frame"
        title="Tank Commander"
        src="/tank-commander.html"
        allow="fullscreen"
      />
    </section>
  );
}

export default GameCanvas;
