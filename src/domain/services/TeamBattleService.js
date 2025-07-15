// Servicio de dominio para TeamBattle (Batalla por equipos)

export class TeamBattleService {
  /**
   * Valida reglas de batalla por equipos.
   */
  static validateTeamBattle(heroes, villains) {
    if (!Array.isArray(heroes) || heroes.length < 1) {
      throw new Error('At least one hero is required');
    }
    if (!Array.isArray(villains) || villains.length < 1) {
      throw new Error('At least one villain is required');
    }
  }

  /**
   * Genera un número de rondas con acciones basadas en las estadísticas de los personajes.
   * @param {Array} heroes - Array de héroes con sus estadísticas
   * @param {Array} villains - Array de villanos con sus estadísticas
   * @param {number} roundsCount - Número de rondas
   * @returns {Array<object>} Rondas generadas
   */
  static generateRounds(heroes, villains, roundsCount = 3) {
    const rounds = [];
    
    for (let i = 1; i <= roundsCount; i++) {
      const heroActions = heroes.map(hero => {
        const calculatedDamage = this.calculateDamage(hero, villains);
        return {
          id: hero.id,
          name: hero.name,
          damage: calculatedDamage,
          health: hero.health,
          isAlive: hero.isAlive,
          specialAbility: hero.specialAbility,
          status: hero.status
        };
      });

      const villainActions = villains.map(villain => {
        const calculatedDamage = this.calculateDamage(villain, heroes);
        return {
          id: villain.id,
          name: villain.name,
          damage: calculatedDamage,
          health: villain.health,
          isAlive: villain.isAlive,
          specialAbility: villain.specialAbility,
          status: villain.status
        };
      });

      const heroTotal = heroActions.reduce((sum, action) => sum + action.damage, 0);
      const villainTotal = villainActions.reduce((sum, action) => sum + action.damage, 0);
      
      let result = 'draw';
      if (heroTotal > villainTotal) result = 'heroes';
      else if (villainTotal > heroTotal) result = 'villains';
      
      rounds.push({
        roundNumber: i,
        heroActions,
        villainActions,
        heroTotal,
        villainTotal,
        result
      });
    }
    
    return rounds;
  }

  /**
   * Calcula el daño basado en las estadísticas del atacante.
   * @param {Object} attacker - Personaje atacante
   * @param {Array} enemies - Array de enemigos para calcular defensa promedio
   * @returns {number} Daño calculado
   */
  static calculateDamage(attacker, enemies) {
    if (!attacker.isAlive || attacker.health <= 0) {
      return 0;
    }

    let baseDamage = attacker.attack || 50;
    
    // Aplicar efectos del estado
    baseDamage = this.applyStatusEffects(baseDamage, attacker.status);
    
    // Aplicar afinidad de equipo
    if (attacker.teamAffinity > 0) {
      baseDamage += Math.floor(baseDamage * (attacker.teamAffinity / 100));
    } else if (attacker.teamAffinity < 0) {
      baseDamage -= Math.floor(baseDamage * (Math.abs(attacker.teamAffinity) / 100));
    }
    
    // Calcular golpe crítico
    const critRoll = Math.random() * 100;
    if (critRoll <= (attacker.critChance || 10)) {
      baseDamage = Math.floor(baseDamage * 1.5); // 50% más de daño
    }
    
    // Agregar variabilidad aleatoria (±10%)
    const randomFactor = 0.9 + (Math.random() * 0.2);
    baseDamage = Math.floor(baseDamage * randomFactor);
    
    // Calcular defensa promedio de los enemigos
    const avgDefense = enemies.reduce((sum, enemy) => sum + (enemy.defense || 30), 0) / enemies.length;
    const damageReduction = Math.min(avgDefense * 0.5, baseDamage * 0.8); // Máximo 80% de reducción
    
    const finalDamage = Math.max(1, baseDamage - damageReduction);
    
    return Math.floor(finalDamage);
  }

  /**
   * Aplica efectos del estado al daño.
   * @param {number} damage - Daño base
   * @param {string} status - Estado del personaje
   * @returns {number} Daño modificado
   */
  static applyStatusEffects(damage, status) {
    switch (status) {
      case 'fortalecido':
        return Math.floor(damage * 1.3); // +30% de daño
      case 'debilitado':
        return Math.floor(damage * 0.7); // -30% de daño
      case 'envenenado':
        return Math.floor(damage * 0.9); // -10% de daño
      case 'paralizado':
        return Math.floor(damage * 0.5); // -50% de daño
      case 'congelado':
        return Math.floor(damage * 0.8); // -20% de daño
      case 'normal':
      default:
        return damage;
    }
  }

  /**
   * Determina el resultado final de la batalla según ganadores de rondas.
   * @param {Array<object>} rounds
   * @returns {'heroes'|'villains'|'draw'}
   */
  static determineFinalResult(rounds) {
    let heroesWins = 0, villainsWins = 0;
    rounds.forEach(r => {
      if (r.result === 'heroes') heroesWins++;
      if (r.result === 'villains') villainsWins++;
    });
    if (heroesWins > villainsWins) return 'heroes';
    if (villainsWins > heroesWins) return 'villains';
    return 'draw';
  }

  /**
   * Actualiza la salud de los personajes después de una ronda.
   * @param {Array} characters - Array de personajes
   * @param {number} totalDamageReceived - Daño total recibido
   */
  static updateCharacterHealth(characters, totalDamageReceived) {
    characters.forEach(character => {
      if (character.isAlive) {
        const damagePerCharacter = Math.floor(totalDamageReceived / characters.filter(c => c.isAlive).length);
        const actualDamage = Math.max(0, damagePerCharacter - (character.damageReduction || 0));
        
        character.health = Math.max(0, character.health - actualDamage);
        character.isAlive = character.health > 0;
        
        if (!character.isAlive) {
          character.status = 'defeated';
        }
      }
    });
  }

  /**
   * Verifica si el personaje puede usar su habilidad especial.
   * @param {Object} character - Personaje
   * @returns {boolean} True si puede usar la habilidad
   */
  static canUseSpecialAbility(character) {
    return (character.stamina || 100) >= (character.energyCost || 20) && character.isAlive;
  }

  /**
   * Usa la habilidad especial del personaje.
   * @param {Object} character - Personaje
   * @returns {number} Daño adicional de la habilidad especial
   */
  static useSpecialAbility(character) {
    if (!this.canUseSpecialAbility(character)) {
      return 0;
    }

    character.stamina = (character.stamina || 100) - (character.energyCost || 20);
    
    // La habilidad especial hace 1.5x el daño base
    return Math.floor((character.attack || 50) * 1.5);
  }
  /**
   * Ejecuta un ataque y actualiza el estado de los personajes en la batalla.
   * @param {Object} battle - Objeto TeamBattle
   * @param {Object} info - Información del ataque
   * @param {string} info.attackerType
   * @param {string} info.attackerId
   * @param {string} info.targetId
   * @param {number} info.damage
   * @returns {Object} battle actualizado
   */
  static executeAttack(battle, { attackerType, attackerId, targetId, damage }) {
    // Asegurarse de que battle.characters exista
    if (!battle.characters || !Array.isArray(battle.characters)) {
      battle.characters = [];
      console.error('No characters array found in battle');
      throw new Error('La batalla no tiene un array de personajes válido');
    }
    
    // Buscar atacante y objetivo
    const attacker = battle.characters.find(c => c.id === attackerId && c.type === attackerType);
    const target = battle.characters.find(c => c.id === targetId && c.type !== attackerType);
    
    if (!attacker) {
      console.error(`Atacante no encontrado: ${attackerId}, ${attackerType}`, battle.characters);
      throw new Error(`Atacante ${attackerId} (${attackerType}) no encontrado en la batalla`);
    }
    
    if (!target) {
      console.error(`Objetivo no encontrado: ${targetId}`, battle.characters);
      throw new Error(`Objetivo ${targetId} no encontrado en la batalla`);
    }
    
    // Aplicar daño
    target.hpCurrent = Math.max(0, (target.hpCurrent || target.hpMax || 0) - damage);
    target.isAlive = target.hpCurrent > 0;
    
    // Verificar si la batalla terminó
    if (!battle.result || battle.result === 'ongoing') {
      const heroesAlive = battle.characters.filter(c => c.type === 'hero' && c.isAlive);
      const villainsAlive = battle.characters.filter(c => c.type === 'villain' && c.isAlive);
      if (heroesAlive.length === 0 || villainsAlive.length === 0) {
        battle.status = 'finished';
        if (heroesAlive.length === 0 && villainsAlive.length > 0) battle.result = 'villains';
        else if (villainsAlive.length === 0 && heroesAlive.length > 0) battle.result = 'heroes';
        else battle.result = 'draw';
      }
    }
    
    // Registrar el ataque
    if (!battle.attackHistory) {
      battle.attackHistory = [];
    }
    
    battle.attackHistory.push({
      timestamp: new Date().toISOString(),
      attackerId,
      targetId,
      damage,
      attackerType,
      targetHpAfter: target.hpCurrent
    });
    
    return battle;
  }

  /**
   * Procesa una ronda manual con acciones enviadas por el usuario.
   * @param {TeamBattle} battle
   * @param {Array} heroActions - [{ id, action, target }]
   * @param {Array} villainActions - [{ id, action, target }]
   */
  static processRound(battle, heroActions, villainActions) {
    if (battle.mode && battle.mode === 'manual') {
      throw new Error('No se puede ejecutar ronda automática en modo manual. Usa ataques individuales.');
    }
    const roundNumber = battle.currentRoundIndex + 1;
    let heroTotal = 0, villainTotal = 0;
    // calcular daño y aplicar a targets
    const computeActions = (actions, defenders) => {
      return actions.map(act => {
        const attacker = battle.characters.find(c => c.id === act.id);
        const target = battle.characters.find(c => c.id === act.target);
        const base = this.calculateDamage(attacker, defenders);
        const extra = act.action === 'special' ? this.useSpecialAbility(attacker) : 0;
        const damage = base + extra;
        // aplicar daño al target usando hpCurrent
        if (target && target.isAlive) {
          const prevHp = (typeof target.hpCurrent === 'number') ? target.hpCurrent : target.health;
          const newHp = Math.max(0, prevHp - damage);
          target.hpCurrent = newHp;
          target.isAlive = newHp > 0;
        }
        return { id: act.id, damage };
      });
    };
    const heroes = battle.characters.filter(c => battle.heroIds.includes(c.id));
    const villains = battle.characters.filter(c => battle.villainIds.includes(c.id));
    const hActs = computeActions(heroActions, villains);
    const vActs = computeActions(villainActions, heroes);
    heroTotal = hActs.reduce((s,a) => s + a.damage, 0);
    villainTotal = vActs.reduce((s,a) => s + a.damage, 0);
    let result = 'draw';
    if (heroTotal > villainTotal) result = 'heroes';
    else if (villainTotal > heroTotal) result = 'villains';
    // registrar ronda
    battle.rounds.push({ roundNumber, heroActions: hActs, villainActions: vActs, heroTotal, villainTotal, result });
    battle.currentRoundIndex = battle.rounds.length;
    // verificar fin de batalla: todos de un equipo caídos
    const anyHeroAlive = heroes.some(h => h.isAlive);
    const anyVillainAlive = villains.some(v => v.isAlive);
    if (!anyHeroAlive || !anyVillainAlive) {
      battle.status = 'finished';
      battle.result = (!anyHeroAlive && !anyVillainAlive) ? 'draw' : (!anyHeroAlive ? 'villains' : 'heroes');
    }
    return battle;
  }

}

export default TeamBattleService;
