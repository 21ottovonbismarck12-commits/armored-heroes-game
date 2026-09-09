import mongoose from 'mongoose';

const combatLogSchema = new mongoose.Schema(
  {
    player1Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true
    },
    player2Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    loser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    moves: [{
      turn: Number,
      playerId: mongoose.Schema.Types.ObjectId,
      action: String,
      damage: Number,
      timestamp: Date
    }],
    duration: Number,
    rewardGold: Number,
    rewardExperience: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model('CombatLog', combatLogSchema);
