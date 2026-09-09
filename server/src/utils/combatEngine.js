export const calculateDamage = (attacker, defender) => {
  const baseAttack = attacker.stats.attack;
  const defense = defender.stats.defense;
  const variance = Math.random() * 0.2 - 0.1;
  
  let damage = Math.max(1, baseAttack - defense + (baseAttack * variance));
  
  if (Math.random() * 100 < attacker.stats.criticalChance) {
    damage *= 1.5;
  }
  
  return Math.floor(damage);
};

export const calculateWinner = (player1Stats, player2Stats) => {
  const player1Speed = player1Stats.speed || 5;
  const player2Speed = player2Stats.speed || 5;
  
  return Math.random() * player1Speed > Math.random() * player2Speed ? 1 : 2;
};

export const calculateRewards = (winner, loser, winnerLevel, loserLevel) => {
  const levelDiff = Math.max(0, loserLevel - winnerLevel);
  const baseExp = 50;
  const baseGold = 100;
  
  const expMultiplier = 1 + (levelDiff * 0.1);
  const goldMultiplier = 1 + (levelDiff * 0.15);
  
  return {
    experience: Math.floor(baseExp * expMultiplier),
    gold: Math.floor(baseGold * goldMultiplier)
  };
};

export const simulateCombat = (player1, player2) => {
  let p1Health = player1.stats.health;
  let p2Health = player2.stats.health;
  const moves = [];
  let turn = 0;
  let maxTurns = 50;
  
  while (p1Health > 0 && p2Health > 0 && turn < maxTurns) {
    turn++;
    
    if (Math.random() * (player1.stats.speed + 10) > Math.random() * (player2.stats.speed + 10)) {
      const damage = calculateDamage(player1.stats, player2.stats);
      p2Health -= damage;
      moves.push({
        turn,
        playerId: player1.id,
        action: 'attack',
        damage
      });
    } else {
      const damage = calculateDamage(player2.stats, player1.stats);
      p1Health -= damage;
      moves.push({
        turn,
        playerId: player2.id,
        action: 'attack',
        damage
      });
    }
  }
  
  const winner = p1Health > 0 ? player1 : player2;
  const loser = p1Health > 0 ? player2 : player1;
  
  return {
    winner,
    loser,
    moves,
    duration: turn,
    rewards: calculateRewards(winner, loser, player1.level, player2.level)
  };
};
