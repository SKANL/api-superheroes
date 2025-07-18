import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const VillainSchema = new Schema({
  name: { type: String, required: true },
  alias: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  health: { type: Number, default: 100 },
  attack: { type: Number, default: 50 },
  defense: { type: Number, default: 30 },
  specialAbility: { type: String, default: 'Dark Attack' },
  isAlive: { type: Boolean, default: true },
  roundsWon: { type: Number, default: 0 },
  damage: { type: Number, default: 0 },
  status: { type: String, default: 'normal' },
  stamina: { type: Number, default: 100 },
  speed: { type: Number, default: 50 },
  critChance: { type: Number, default: 10 },
  teamAffinity: { type: Number, default: 0 },
  energyCost: { type: Number, default: 20 },
  damageReduction: { type: Number, default: 0 },
  owner: { type: Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
VillainSchema.index({ city: 1 });
VillainSchema.index({ owner: 1 });
VillainSchema.index({ city: 1, owner: 1 });

export const VillainModel = model('Villain', VillainSchema);
