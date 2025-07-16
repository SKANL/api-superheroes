// UseCase para finalizar la batalla y devolver resultados finales
export class FinishBattleUseCase {
  constructor({ battleRepository }) {
    this.battleRepository = battleRepository;
  }

  async execute(battleId) {
    const battle = await this.battleRepository.findById(battleId);
    if (!battle) throw new Error('Battle not found');
    // If auto mode, simulate full battle
    if (battle.mode === 'auto') {
      // Alternate attacks until one dies or max rounds
      const rounds = [];
      let round = 0;
      while (battle.status !== 'finished' && round < 10) {
        round++;
        // Hero attacks villain
        const att = battle.characters[0];
        const tgt = battle.characters[1];
        if (att.isAlive && tgt.isAlive) {
          const dmg = Math.floor((att.attack||0) * (1 + Math.random()));
          tgt.hpCurrent = Math.max(0, tgt.hpCurrent - dmg);
          tgt.isAlive = tgt.hpCurrent>0;
          battle.attackHistory.push({ attackerId: att.id, targetId: tgt.id, damage: dmg, targetHpAfter: tgt.hpCurrent });
        }
        // Villain attacks hero
        const att2 = battle.characters[1];
        const tgt2 = battle.characters[0];
        if (att2.isAlive && tgt2.isAlive) {
          const dmg2 = Math.floor((att2.attack||0) * (1 + Math.random()));
          tgt2.hpCurrent = Math.max(0, tgt2.hpCurrent - dmg2);
          tgt2.isAlive = tgt2.hpCurrent>0;
          battle.attackHistory.push({ attackerId: att2.id, targetId: tgt2.id, damage: dmg2, targetHpAfter: tgt2.hpCurrent });
        }
        // Record round summary
        rounds.push({ roundNumber: round, heroActions: [{ damage: battle.attackHistory.slice(-2)[0].damage }], villainActions: [{ damage: battle.attackHistory.slice(-1)[0].damage }], heroTotal: battle.attackHistory.slice(-2)[0].damage, villainTotal: battle.attackHistory.slice(-1)[0].damage, result: battle.characters[0].isAlive && !battle.characters[1].isAlive ? 'hero' : !battle.characters[0].isAlive && battle.characters[1].isAlive ? 'villain' : 'draw' });
        if (!battle.characters[0].isAlive || !battle.characters[1].isAlive) {
          battle.status = 'finished';
          battle.result = battle.characters[0].isAlive && !battle.characters[1].isAlive ? 'hero' : !battle.characters[0].isAlive && battle.characters[1].isAlive ? 'villain' : 'draw';
        }
      }
      // Persist
      await this.battleRepository.update(battleId, battle);
      // Statistics
      const statistics = battle.characters.map(c=>({ name: c.name||c.alias, type: c.type, health: c.hpCurrent, isAlive: c.isAlive }));
      return { result: battle.result, statistics, battleHistory: { rounds } };
    }
    // Manual mode: simply return current status and history
    const statistics = battle.characters.map(c=>({ name: c.name||c.alias, type: c.type, health: c.hpCurrent, isAlive: c.isAlive }));
    return { result: battle.result, statistics, battleHistory: { attackHistory: battle.attackHistory } };
  }
}

export default FinishBattleUseCase;
