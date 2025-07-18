import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const BattleSchema = new Schema({
  heroId: { type: Types.ObjectId, ref: 'Hero', required: true },
  villainId: { type: Types.ObjectId, ref: 'Villain', required: true },
  date: { type: Date, default: Date.now },
  location: { type: String },
  mode: { type: String, enum: ['manual', 'auto'], default: 'manual' },
  rounds: { type: Array, default: [] },
  attackHistory: { type: Array, default: [] },
  currentRoundIndex: { type: Number, default: 0 },
  status: { type: String, enum: ['in_progress', 'finished'], default: 'in_progress' },
  result: { type: String, enum: ['hero', 'villain', 'draw'], default: null },
  characters: { type: Array, default: [] },
  owner: { type: Types.ObjectId, ref: 'User', required: true }
});

export const BattleModel = model('Battle', BattleSchema);
