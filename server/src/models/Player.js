import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    characterName: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 100
    },
    experience: {
      type: Number,
      default: 0,
      min: 0
    },
    gold: {
      type: Number,
      default: 0,
      min: 0
    },
    crystals: {
      type: Number,
      default: 0,
      min: 0
    },
    stats: {
      health: { type: Number, default: 100 },
      attack: { type: Number, default: 10 },
      defense: { type: Number, default: 5 },
      speed: { type: Number, default: 8 },
      criticalChance: { type: Number, default: 5 }
    },
    currentHealth: {
      type: Number,
      default: 100
    },
    wins: {
      type: Number,
      default: 0,
      min: 0
    },
    losses: {
      type: Number,
      default: 0,
      min: 0
    },
    rank: {
      type: Number,
      default: 0,
      min: 0
    },
    equipment: {
      helmet: mongoose.Schema.Types.Mixed,
      chest: mongoose.Schema.Types.Mixed,
      legs: mongoose.Schema.Types.Mixed,
      weapon: mongoose.Schema.Types.Mixed,
      accessories: [mongoose.Schema.Types.Mixed]
    },
    inventory: [mongoose.Schema.Types.Mixed],
    lastBattle: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model('Player', playerSchema);
