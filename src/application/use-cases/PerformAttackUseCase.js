// Use Case para realizar ataques individuales en el juego de peleas
import { TeamBattleService } from '../../domain/services/TeamBattleService.js';

export class PerformAttackUseCase {
  constructor({ teamBattleRepository, heroRepository, villainRepository }) {
    this.teamBattleRepository = teamBattleRepository;
    this.heroRepository = heroRepository;
    this.villainRepository = villainRepository;
  }

  async execute({ battleId, attackerType, attackerId, targetId, attackType = 'normal' }) {
    // Validar entrada
    if (!battleId || !attackerType || !attackerId || !targetId) {
      throw new Error('Faltan parámetros requeridos para el ataque');
    }

    if (!['hero', 'villain'].includes(attackerType)) {
      throw new Error('attackerType debe ser "hero" o "villain"');
    }

    if (!['normal', 'special'].includes(attackType)) {
      throw new Error('attackType debe ser "normal" o "special"');
    }

    // Obtener la batalla
    const battle = await this.teamBattleRepository.findById(battleId);
    if (!battle) {
      throw new Error('Batalla no encontrada');
    }

    // Verificar que la batalla no haya terminado
    if (battle.result && battle.result !== 'ongoing') {
      throw new Error('La batalla ya ha terminado');
    }

    // Verificar que el atacante pertenece al equipo correcto
    const isValidAttacker = attackerType === 'hero' 
      ? battle.heroIds.includes(attackerId)
      : battle.villainIds.includes(attackerId);

    if (!isValidAttacker) {
      throw new Error(`El ${attackerType} ${attackerId} no pertenece a esta batalla`);
    }

    // Verificar que el objetivo pertenece al equipo contrario
    const isValidTarget = attackerType === 'hero'
      ? battle.villainIds.includes(targetId)
      : battle.heroIds.includes(targetId);

    if (!isValidTarget) {
      throw new Error(`El objetivo ${targetId} no es válido`);
    }

    // Obtener los personajes
    const attacker = attackerType === 'hero'
      ? await this.heroRepository.findById(attackerId)
      : await this.villainRepository.findById(attackerId);

    const target = attackerType === 'hero'
      ? await this.villainRepository.findById(targetId)
      : await this.heroRepository.findById(targetId);

    if (!attacker || !target) {
      throw new Error('Atacante o objetivo no encontrado');
    }
    
    // Comprobar si ya hay una batalla en progreso con estos personajes
    const battleChar = battle.characters?.find(c => c.id === attackerId);
    if (battleChar) {
      // Usar los stats de la batalla en curso (con daño ya aplicado)
      attacker.hpCurrent = battleChar.hpCurrent;
      attacker.hpMax = battleChar.hpMax;
      attacker.isAlive = battleChar.isAlive;
    }

    // Calcular daño base usando attack stat
    const baseDamage = attacker.attack || 0;
    let multiplier = 1;
    let critical = false;

    // Aplicar modificadores según tipo de ataque
    if (attackType === 'special') {
      multiplier = 1.5; // 50% más daño
      const speed = attacker.speed || 0;
      const criticalChance = Math.min((speed / 100) * 0.3, 0.5);
      critical = Math.random() < criticalChance;
      if (critical) {
        multiplier = 2.0; // Daño crítico
      }
    } else {
      // Ataque normal - probabilidad de crítico basada en critChance
      const critChance = (attacker.critChance || 10) / 100;
      critical = Math.random() < critChance;
      if (critical) {
        multiplier = 1.5;
      }
    }

    // Calcular daño final
    const finalDamage = Math.max(1, Math.floor(baseDamage * multiplier));

    // Crear resultado del ataque
    const attackResult = {
      damage: finalDamage,
      critical,
      attackType,
      message: this._generateAttackMessage(attacker, target, finalDamage, critical, attackType)
    };

    // Ejecutar el ataque usando el servicio de dominio
    // Usar directamente la función estática del servicio para evitar problemas de referencia this
    const updatedBattle = TeamBattleService.executeAttack(battle, {
      attackerId,
      targetId,
      damage: finalDamage,
      attackerType
    });

    // Guardar la batalla actualizada
    await this.teamBattleRepository.update(battleId, updatedBattle);

    return {
      battle: updatedBattle,
      attackResult
    };
  }

  _generateAttackMessage(attacker, target, damage, critical, attackType) {
    const attackName = attacker.name || attacker.alias;
    const targetName = target.name || target.alias;
    
    let baseMessage = `${attackName} ataca a ${targetName}`;
    
    if (attackType === 'special') {
      baseMessage = `${attackName} usa un ataque especial contra ${targetName}`;
    }
    
    if (critical) {
      baseMessage += ' ¡CRÍTICO!';
    }
    
    baseMessage += ` causando ${damage} puntos de daño.`;
    
    return baseMessage;
  }
}

export default PerformAttackUseCase;
