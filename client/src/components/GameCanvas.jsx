import { useEffect, useRef, useState } from 'react';
import { Engine } from '@babylonjs/core/Engines/engine';
import { createGameScene } from '../game3d/scene';
import { DEFAULT_LOADOUT, PARTS, calculateStats } from '../game3d/modularTank';
import './GameCanvas.css';

const slots = [
  ['hull', 'Chasis'],
  ['tracks', 'Orugas'],
  ['turret', 'Torreta'],
  ['gun', 'Cañón'],
];

function GameCanvas({ player, socket }) {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [mode, setMode] = useState('3d');
  const [loadout, setLoadout] = useState(DEFAULT_LOADOUT);
  const [stats, setStats] = useState(() => calculateStats(DEFAULT_LOADOUT));
  const [fireCount, setFireCount] = useState(0);

  useEffect(() => {
    if (mode !== '3d' || !canvasRef.current) return undefined;
    let disposed = false;
    const engine = new Engine(canvasRef.current, true, { alpha: true, preserveDrawingBuffer: true, stencil: true });
    createGameScene(engine, canvasRef.current, { loadout }).then((handle) => {
      if (disposed) {
        handle.dispose();
        engine.dispose();
        return;
      }
      gameRef.current = handle;
      engine.runRenderLoop(() => handle.scene.render());
    });
    const onResize = () => engine.resize();
    window.addEventListener('resize', onResize);
    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      gameRef.current?.dispose();
      gameRef.current = null;
      engine.stopRenderLoop();
      engine.dispose();
    };
  }, [mode]);

  const changePart = (slot, value) => {
    const next = { ...loadout, [slot]: value };
    setLoadout(next);
    setStats(calculateStats(next));
    gameRef.current?.setLoadout(next);
    socket?.emit('player:loadout', { loadout: next });
  };

  const fire = () => {
    if (gameRef.current?.tank.fire()) setFireCount((count) => count + 1);
  };

  return (
    <section className="game-module game-module-3d" aria-label="Arena 3D modular de Armored Heroes">
      <div className="game-module-toolbar">
        <span>Armored Heroes · Arena 3D · {player?.characterName || 'Jugador'}</span>
        <div className="game-mode-actions">
          <button className={mode === '3d' ? 'mode-active' : ''} onClick={() => setMode('3d')}>3D modular</button>
          <button className={mode === '2d' ? 'mode-active' : ''} onClick={() => setMode('2d')}>Modo clásico 2D</button>
        </div>
      </div>
      <div className="game-stage">
        {mode === '3d' ? (
          <canvas ref={canvasRef} className="game-3d-canvas" aria-label="Arena 3D" />
        ) : (
          <iframe className="game-module-frame" title="Tank Commander clásico" src="/tank-commander.html?online=1" allow="fullscreen" />
        )}
        {mode === '3d' && (
          <aside className="garage-panel">
            <div className="garage-heading"><span>GARAGE MODULAR</span><small>piezas intercambiables</small></div>
            {slots.map(([slot, label]) => (
              <label className="part-row" key={slot}>
                <span>{label}</span>
                <select value={loadout[slot]} onChange={(event) => changePart(slot, event.target.value)}>
                  {Object.entries(PARTS[slot]).map(([id, part]) => <option key={id} value={id}>{part.label}</option>)}
                </select>
              </label>
            ))}
            <div className="stat-grid">
              <div><b>{stats.hp}</b><span>VIDA</span></div>
              <div><b>{stats.armor}</b><span>BLINDAJE</span></div>
              <div><b>{stats.damage}</b><span>DAÑO</span></div>
              <div><b>{stats.speed.toFixed(1)}</b><span>VELOCIDAD</span></div>
            </div>
            <button className="fire-button" onClick={fire}>DISPARAR <small>ESPACIO · {fireCount}</small></button>
            <p className="controls-note">WASD mover · ← → torreta · rueda cámara</p>
          </aside>
        )}
      </div>
    </section>
  );
}

export default GameCanvas;
