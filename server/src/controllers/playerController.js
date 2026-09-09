import Player from '../models/Player.js';
import { generateRandomItem } from '../utils/itemGenerator.js';

export const getPlayer = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user.id });
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        message: 'Jugador no encontrado' 
      });
    }

    res.status(200).json({
      success: true,
      player
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener jugador',
      error: error.message 
    });
  }
};

export const updatePlayerStats = async (req, res) => {
  try {
    const { stats } = req.body;
    
    const player = await Player.findOneAndUpdate(
      { userId: req.user.id },
      { stats },
      { new: true }
    );

    if (!player) {
      return res.status(404).json({ 
        success: false, 
        message: 'Jugador no encontrado' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Estadisticas actualizadas',
      player
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar estadisticas',
      error: error.message 
    });
  }
};

export const addExperience = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cantidad de experiencia invalida' 
      });
    }

    const player = await Player.findOne({ userId: req.user.id });
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        message: 'Jugador no encontrado' 
      });
    }

    player.experience += amount;
    const expNeeded = player.level * 100;

    let leveledUp = false;
    while (player.experience >= expNeeded) {
      player.level += 1;
      player.experience -= expNeeded;
      leveledUp = true;
      
      player.stats.health += 10;
      player.stats.attack += 2;
      player.stats.defense += 1;
      player.stats.speed += 1;
      player.currentHealth = player.stats.health;
    }

    await player.save();

    res.status(200).json({
      success: true,
      message: 'Experiencia anadida',
      player,
      leveledUp
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al anadir experiencia',
      error: error.message 
    });
  }
};

export const equipItem = async (req, res) => {
  try {
    const { itemId, slot } = req.body;
    
    if (!['helmet', 'chest', 'legs', 'weapon'].includes(slot)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Slot de equipo invalido' 
      });
    }

    const player = await Player.findOne({ userId: req.user.id });
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        message: 'Jugador no encontrado' 
      });
    }

    const itemIndex = player.inventory.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item no encontrado en inventario' 
      });
    }

    const item = player.inventory[itemIndex];

    if (player.equipment[slot]) {
      player.inventory.push(player.equipment[slot]);
    }

    player.equipment[slot] = item;
    player.inventory.splice(itemIndex, 1);

    await player.save();

    res.status(200).json({
      success: true,
      message: 'Item equipado',
      player
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al equipar item',
      error: error.message 
    });
  }
};

export const addToInventory = async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user.id });
    
    if (!player) {
      return res.status(404).json({ 
        success: false, 
        message: 'Jugador no encontrado' 
      });
    }

    if (player.inventory.length >= 30) {
      return res.status(400).json({ 
        success: false, 
        message: 'Inventario lleno' 
      });
    }

    const newItem = generateRandomItem();
    player.inventory.push(newItem);
    await player.save();

    res.status(200).json({
      success: true,
      message: 'Item anadido al inventario',
      item: newItem,
      player
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al anadir item',
      error: error.message 
    });
  }
};

export const addGold = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cantidad de oro invalida' 
      });
    }

    const player = await Player.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { gold: amount } },
      { new: true }
    );

    if (!player) {
      return res.status(404).json({ 
        success: false, 
        message: 'Jugador no encontrado' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Oro anadido',
      player
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error al anadir oro',
      error: error.message 
    });
  }
};
