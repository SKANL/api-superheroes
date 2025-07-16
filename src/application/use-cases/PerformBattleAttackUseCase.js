// UseCase para manejar ataques individuales en Battle
export class PerformBattleAttackUseCase {
  constructor({ battleRepository }) {
    this.battleRepository = battleRepository;
  }

  async execute({ battleId, attackType = 'normal' }) {
    const battle = await this.battleRepository.findById(battleId);
    if (!battle) throw new Error('Battle not found');
    if (battle.status === 'finished') throw new Error('Battle already finished');
    // Only two characters: [0]=hero, [1]=villain
    const [hero, villain] = battle.characters;
    // Hero attacks villain first
    const attacker = hero.isAlive ? hero : villain;
    const target = attacker === hero ? villain : hero;
    // Determine base damage
    const base = attacker.attack || 0;
    const damage = attackType === 'special'
      ? Math.floor(base * 1.5)
      : Math.floor(base * (Math.random() < ((attacker.critChance||0)/100) ? 1.5 : 1));
    // Apply damage
    target.hpCurrent = Math.max(0, (target.hpCurrent||target.hpMax) - damage);
    target.isAlive = target.hpCurrent > 0;
    // Record attack history
    battle.attackHistory.push({
      attackerId: attacker.id,
      targetId: target.id,
      damage,
      targetHpAfter: target.hpCurrent
    });
    // Update battle status if someone died
    if (!hero.isAlive || !villain.isAlive) {
      battle.status = 'finished';
      battle.result = !hero.isAlive && !villain.isAlive
        ? 'draw'
        : (!hero.isAlive ? 'villain' : 'hero');
    }
    // Persist
    await this.battleRepository.update(battleId, battle);
    return { battle, attackResult: { damage, attackType } };
  }
}

export default PerformBattleAttackUseCase;
