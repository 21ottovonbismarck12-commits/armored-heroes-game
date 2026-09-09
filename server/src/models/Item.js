import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['helmet', 'chest', 'legs', 'weapon', 'accessory'],
      required: true
    },
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
      default: 'common'
    },
    stats: {
      health: { type: Number, default: 0 },
      attack: { type: Number, default: 0 },
      defense: { type: Number, default: 0 },
      speed: { type: Number, default: 0 },
      criticalChance: { type: Number, default: 0 }
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: null
    },
    requiredLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 100
    },
    value: {
      type: Number,
      default: 100
    },
    sellPrice: {
      type: Number,
      default: 50
    }
  },
  { timestamps: true }
);

export default mongoose.model('Item', itemSchema);
