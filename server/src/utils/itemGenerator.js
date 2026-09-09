import mongoose from 'mongoose';

const rarityWeights = {
  common: 0.50,
  uncommon: 0.30,
  rare: 0.12,
  epic: 0.06,
  legendary: 0.02
};

const itemTemplates = {
  helmet: [
    {
      name: 'Casco de Hierro',
      rarity: 'common',
      stats: { health: 5, defense: 3 },
      description: 'Un casco basico de hierro'
    },
    {
      name: 'Casco de Acero',
      rarity: 'uncommon',
      stats: { health: 10, defense: 6 },
      description: 'Casco reforzado de acero'
    },
    {
      name: 'Casco de Dragon',
      rarity: 'epic',
      stats: { health: 20, defense: 12, speed: 2 },
      description: 'Legendario casco hecho de escamas de dragon'
    },
    {
      name: 'Corona de Titan',
      rarity: 'legendary',
      stats: { health: 30, defense: 15, speed: 3, criticalChance: 5 },
      description: 'La corona de los titanes, otorga poder supremo'
    }
  ],
  chest: [
    {
      name: 'Armadura de Cuero',
      rarity: 'common',
      stats: { health: 8, defense: 4 },
      description: 'Armadura basica de cuero'
    },
    {
      name: 'Pechera de Acero',
      rarity: 'uncommon',
      stats: { health: 15, defense: 8 },
      description: 'Pechera reforzada de acero'
    },
    {
      name: 'Armadura Negra',
      rarity: 'rare',
      stats: { health: 20, defense: 10, attack: 2 },
      description: 'Armadura oscura y poderosa'
    },
    {
      name: 'Armadura Celestial',
      rarity: 'legendary',
      stats: { health: 40, defense: 20, attack: 5, speed: 2 },
      description: 'Armadura forjada en los cielos'
    }
  ],
  weapon: [
    {
      name: 'Espada de Hierro',
      rarity: 'common',
      stats: { attack: 5 },
      description: 'Una espada simple pero efectiva'
    },
    {
      name: 'Espada de Acero',
      rarity: 'uncommon',
      stats: { attack: 10, criticalChance: 2 },
      description: 'Espada de acero templado'
    },
    {
      name: 'Excalibur',
      rarity: 'legendary',
      stats: { attack: 25, criticalChance: 10, speed: 3 },
      description: 'La legendaria espada del Rey Arturo'
    }
  ]
};

export const getRandomRarity = () => {
  const roll = Math.random();
  let accumulated = 0;
  
  for (const [rarity, weight] of Object.entries(rarityWeights)) {
    accumulated += weight;
    if (roll <= accumulated) {
      return rarity;
    }
  }
  
  return 'common';
};

export const generateRandomItem = (type = null) => {
  const types = type ? [type] : Object.keys(itemTemplates);
  const selectedType = types[Math.floor(Math.random() * types.length)];
  const templates = itemTemplates[selectedType];
  
  const rarity = getRandomRarity();
  const rarityItems = templates.filter(item => item.rarity === rarity);
  const selectedTemplate = rarityItems.length > 0 
    ? rarityItems[Math.floor(Math.random() * rarityItems.length)]
    : templates[0];
  
  return {
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: selectedType,
    ...selectedTemplate
  };
};

export const getRarityColor = (rarity) => {
  const colors = {
    common: '#808080',
    uncommon: '#4CAF50',
    rare: '#2196F3',
    epic: '#9C27B0',
    legendary: '#FFD700'
  };
  return colors[rarity] || colors.common;
};

export default itemTemplates;
