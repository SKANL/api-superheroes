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
    
    // Validate that both characters exist and have required properties
    if (!hero || !villain) {
      throw new Error('Battle characters not found or invalid');
    }
    
    // Ensure characters have combat properties with defaults
    if (typeof hero.attack === 'undefined') hero.attack = 50;
    if (typeof hero.critChance === 'undefined') hero.critChance = 10;
    if (typeof hero.isAlive === 'undefined') hero.isAlive = true;
    if (typeof villain.attack === 'undefined') villain.attack = 50;
    if (typeof villain.critChance === 'undefined') villain.critChance = 10;
    if (typeof villain.isAlive === 'undefined') villain.isAlive = true;
    
    // Hero attacks villain first
    const attacker = hero.isAlive ? hero : villain;
    const target = attacker === hero ? villain : hero;
    // Determine base damage
    const base = attacker.attack || 0;
    const damage = attackType === 'special'
      ? Math.floor(base * 1.5)
      : Math.floor(base * (Math.random() < ((attacker.critChance||0)/100) ? 1.5 : 1));
    // Apply damage
    const currentHp = typeof target.hpCurrent === 'number' ? target.hpCurrent : target.hpMax;
    const newHp = Math.max(0, currentHp - damage);
    target.hpCurrent = newHp;
    target.isAlive = newHp > 0;
    
    // Update the characters array in the battle object to ensure persistence
    const heroIndex = battle.characters.findIndex(c => c.type === 'hero');
    const villainIndex = battle.characters.findIndex(c => c.type === 'villain');
    
    if (heroIndex !== -1) {
      battle.characters[heroIndex] = { ...hero };
    }
    if (villainIndex !== -1) {
      battle.characters[villainIndex] = { ...villain };
    }
    
    // Increment round counter
    battle.currentRoundIndex = (battle.currentRoundIndex || 0) + 1;
    
    // Record attack history
    battle.attackHistory.push({
      attackerId: attacker.id,
      targetId: target.id,
      damage,
      targetHpAfter: newHp,
      attackerName: attacker.name || attacker.alias,
      targetName: target.name || target.alias,
      attackType: attackType,
      round: battle.currentRoundIndex
    });
    
    // Check if battle finished
    const battleFinished = !hero.isAlive || !villain.isAlive;
    let battleResult = null;
    
    // Update battle status if someone died
    if (battleFinished) {
      battle.status = 'finished';
      battleResult = !hero.isAlive && !villain.isAlive
        ? 'draw'
        : (!hero.isAlive ? 'villain' : 'hero');
      battle.result = battleResult;
    }
    
    // Persist
    await this.battleRepository.update(battleId, battle);
    
    // Create detailed attack result
    const attackResult = {
      damage,
      attackType,
      attackerName: attacker.name || attacker.alias,
      targetName: target.name || target.alias,
      targetHpAfter: newHp,
      targetIsAlive: target.isAlive,
      battleFinished,
      battleResult,
      round: battle.currentRoundIndex,
      message: `${attacker.name || attacker.alias} atacó a ${target.name || target.alias} causando ${damage} de daño (HP después: ${newHp})${battleFinished ? '. ¡Batalla terminada!' : ''}`
    };
    
    return { battle, attackResult };
  }
}

export default PerformBattleAttackUseCase;
