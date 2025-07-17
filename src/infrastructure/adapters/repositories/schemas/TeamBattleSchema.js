import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const TeamBattleSchema = new Schema({
  heroIds: [{ type: Types.ObjectId, ref: 'Hero', required: true }],
  villainIds: [{ type: Types.ObjectId, ref: 'Villain', required: true }],
  date: { type: Date, default: Date.now },
  mode: { type: String, enum: ['manual', 'auto'], default: 'manual' },
  rounds: { type: Array, default: [] },
  currentRoundIndex: { type: Number, default: 0 },
  status: { type: String, enum: ['in_progress', 'finished'], default: 'in_progress' },
  result: { type: String, enum: ['heroes', 'villains', 'draw'], default: null },
  characters: { type: Array, default: [] },
  owner: { type: Types.ObjectId, ref: 'User', required: true }
});

export const TeamBattleModel = model('TeamBattle', TeamBattleSchema);
