import React, { useState } from 'react';
import './Combat.css';

function Combat({ player, opponent, onCombatStart, onCombatEnd }) {
  const [combatStarted, setCombatStarted] = useState(false);
  const [combatResult, setCombatResult] = useState(null);
  const [p1Health, setP1Health] = useState(player?.stats?.health || 100);
  const [p2Health, setP2Health] = useState(opponent?.stats?.health || 100);
  const [turn, setTurn] = useState(1);
  const [log, setLog] = useState([]);

  const handleStartCombat = () => {
    setCombatStarted(true);
    setP1Health(player.stats.health);
    setP2Health(opponent.stats.health);
    setTurn(1);
    setLog([]);

    simulateTurn();
  };

  const simulateTurn = () => {
    const p1Attack = Math.random() * (player.stats.speed + 10);
    const p2Attack = Math.random() * (opponent.stats.speed + 10);

    if (p1Attack > p2Attack) {
      const baseDamage = player.stats.attack - opponent.stats.defense;
      const damage = Math.max(1, baseDamage + Math.random() * 5);
      const isCritical = Math.random() * 100 < player.stats.criticalChance;
      const finalDamage = isCritical ? Math.floor(damage * 1.5) : Math.floor(damage);

      setP2Health(prev => Math.max(0, prev - finalDamage));
      setLog(prev => [...prev, `Tu jugador ataca! Danio: ${finalDamage}${isCritical ? ' (CRITICO!)' : ''}`]);
    } else {
      const baseDamage = opponent.stats.attack - player.stats.defense;
      const damage = Math.max(1, baseDamage + Math.random() * 5);
      const isCritical = Math.random() * 100 < opponent.stats.criticalChance;
      const finalDamage = isCritical ? Math.floor(damage * 1.5) : Math.floor(damage);

      setP1Health(prev => Math.max(0, prev - finalDamage));
      setLog(prev => [...prev, `El oponente ataca! Danio: ${finalDamage}${isCritical ? ' (CRITICO!)' : ''}`]);
    }

    setTurn(prev => prev + 1);
  };

  const getWinner = () => {
    if (p1Health <= 0) return 'opponent';
    if (p2Health <= 0) return 'player';
    return null;
  };

  const winner = getWinner();

  return (
    <div className="combat-container">
      <div className="combat-arena">
        <div className="combatant player-side">
          <div className="combatant-name">{player?.characterName}</div>
          <div className="combatant-level">Nivel {player?.level}</div>
          <div className="health-bar">
            <div 
              className="health-fill player-health"
              style={{ width: `${Math.max(0, (p1Health / player?.stats?.health) * 100)}%` }}
            ></div>
          </div>
          <div className="health-text">{Math.max(0, p1Health)} / {player?.stats?.health}</div>
          <div className="stats-display">
            <span>⚔️ {player?.stats?.attack}</span>
            <span>🛡️ {player?.stats?.defense}</span>
            <span>⭐ {player?.stats?.criticalChance}%</span>
          </div>
        </div>

        <div className="combat-center">
          <div className="vs-text">VS</div>
          {!combatStarted && (
            <button className="btn-fight" onClick={handleStartCombat}>
              ⚔️ LUCHAR
            </button>
          )}
          {combatStarted && !winner && (
            <button className="btn-attack" onClick={simulateTurn}>
              Siguiente Turno ({turn})
            </button>
          )}
          {winner && (
            <div className="combat-result">
              <div className="result-text">
                {winner === 'player' ? '¡TU VICTORIA!' : '¡DERROTA!'}
              </div>
              <button className="btn-end-combat" onClick={() => onCombatEnd(winner)}>
                Volver
              </button>
            </div>
          )}
        </div>

        <div className="combatant opponent-side">
          <div className="combatant-name">{opponent?.characterName}</div>
          <div className="combatant-level">Nivel {opponent?.level}</div>
          <div className="health-bar">
            <div 
              className="health-fill opponent-health"
              style={{ width: `${Math.max(0, (p2Health / opponent?.stats?.health) * 100)}%` }}
            ></div>
          </div>
          <div className="health-text">{Math.max(0, p2Health)} / {opponent?.stats?.health}</div>
          <div className="stats-display">
            <span>⚔️ {opponent?.stats?.attack}</span>
            <span>🛡️ {opponent?.stats?.defense}</span>
            <span>⭐ {opponent?.stats?.criticalChance}%</span>
          </div>
        </div>
      </div>

      <div className="combat-log">
        <h3>📝 Registro de Combate</h3>
        <div className="log-entries">
          {log.map((entry, idx) => (
            <div key={idx} className="log-entry">{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Combat;
