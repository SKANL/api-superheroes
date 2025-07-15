// Script para poblar datos de ejemplo en los archivos JSON
import fs from 'fs-extra';
import path from 'path';

const heroes = [
  { 
    id: '1', 
    name: 'Chapulín Colorado', 
    alias: 'Chapulín', 
    city: 'Ciudad de México', 
    team: 'Los Supergenios',
    hpMax: 120,
    hpCurrent: 120,
    attack: 85,
    defense: 60,
    specialAbility: 'Antena de Vinil',
    isAlive: true,
    roundsWon: 0,
    damage: 0,
    status: 'normal',
    stamina: 110,
    speed: 70,
    critChance: 15,
    teamAffinity: 25,
    energyCost: 25,
    damageReduction: 10
  },
  { 
    id: '2', 
    name: 'Superman', 
    alias: 'Clark', 
    city: 'Metrópolis', 
    team: 'Liga de la Justicia',
    hpMax: 150,
    hpCurrent: 150,
    attack: 120,
    defense: 90,
    specialAbility: 'Visión láser',
    isAlive: true,
    roundsWon: 0,
    damage: 0,
    status: 'normal',
    stamina: 140,
    speed: 100,
    critChance: 20,
    teamAffinity: 35,
    energyCost: 30,
    damageReduction: 25
  }
];
const villains = [
  { 
    id: '10', 
    name: 'El Rata', 
    alias: 'Rata', 
    city: 'Ciudad Gótica',
    hpMax: 90,
    hpCurrent: 90,
    attack: 70,
    defense: 40,
    specialAbility: 'Ataque tóxico',
    isAlive: true,
    roundsWon: 0,
    damage: 0,
    status: 'normal',
    stamina: 95,
    speed: 60,
    critChance: 20,
    teamAffinity: -15,
    energyCost: 30,
    damageReduction: 5
  },
  { 
    id: '11', 
    name: 'Lex Luthor', 
    alias: 'Lex', 
    city: 'Metrópolis',
    hpMax: 110,
    hpCurrent: 110,
    attack: 90,
    defense: 70,
    specialAbility: 'Rayo de kryptonita',
    isAlive: true,
    roundsWon: 0,
    damage: 0,
    status: 'normal',
    stamina: 120,
    speed: 55,
    critChance: 15,
    teamAffinity: -10,
    energyCost: 35,
    damageReduction: 15
  }
];
const battles = [
  { id: '100', heroId: '2', villainId: '11', date: new Date().toISOString(), result: 'draw' }
];

async function seed() {
  await fs.outputJson(path.resolve('data/superheroes.json'), heroes, { spaces: 2 });
  await fs.outputJson(path.resolve('data/villains.json'), villains, { spaces: 2 });
  await fs.outputJson(path.resolve('data/battles.json'), battles, { spaces: 2 });
  console.log('Datos de ejemplo cargados.');
}

seed();
