import CombatLog from '../models/CombatLog.js';
import Player from '../models/Player.js';
import { simulateCombat, calculateRewards } from '../utils/combatEngine.js';
import { generateRandomItem } from '../utils/itemGenerator.js';

export const startCombat = async (req, res) => {
  try {
    const { opponentId } = req.body;
    
    const player1 = await Player.findOne({ userId: req.user.id });
    const player2 = await Player.findById(opponentId);
    
    if (!player1 || !player2) {
      return res.status(404).json({ 
        success: false, 
        message: 'Jugador no encontrado' 
      });
    }

    const combatResult = simulateCombat(
      { ...player1.toObject(), id: player1._id },
      { ...player2.toObject(), id: player2._id }
    );

    const { experience, gold } = combatResult.rewards;

    if (combatResult.winner._id.toString() === player1._id.toString()) {
      player1.wins += 1;
      player1.experience += experience;
      player1.gold += gold;
      player2.losses += 1;
    } else {
      player2.wins += 1;
      player2.experience += experience;
      player2.gold += gold;
      player1.losses += 1;
    }

    if (Math.random() < 0.3) {
      const newItem = generateRandomItem();
      if (combatResult.winner._id.toString() === player1._id.toString()) {
        if (player1.inventory.length < 30) {
          player1.inventory.push(newItem);
        }
      } else {
        if (player2.inventory.length < 30) {
          player2.inventory.push(newItem);
        }
      }
    }

    await player1.save();
    await player2.save();

    const combatLog = await CombatLog.create({
      player1Id: player1._id,
      player2Id: player2._id,
      winner: combatResult.winner._id,
      loser: combatResult.loser._id,
      moves: combatResult.moves,
      duration: combatResult.duration,
      rewardGold: gold,
      rewardExperience: experience
    });

    res.status(200).json({
      success: true,
      message: 'Combate completado',
      combatLog,
      winner: combatResult.winner._id.toString() === player1._id.toString() ? 'player1' : 'player2',
      rewards: {
        experience,
        gold
      },
      playerStats: {
        player1: {
          wins: player1.wins,
          losses: player1.losses,
          level: player1.level,
          experience: player1.experience
        },
        player2: {
          wins: player2.wins,
          losses: player2.losses,
          level: player2.level,
          experience: player2.experience
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al iniciar combate',
      error: error.message 
    });
  }
};

export const getCombatHistory = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user.id });
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        message: 'Jugador no encontrado' 
      });
    }

    const combatLogs = await CombatLog.find({
      $or: [{ player1Id: player._id }, { player2Id: player._id }]
    })
    .sort({ createdAt: -1 })
    .limit(20);

    res.status(200).json({
      success: true,
      combatLogs
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener historial de combates',
      error: error.message 
    });
  }
};
