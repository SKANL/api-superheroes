import 'dotenv/config';
import { ServerConfig } from './server.config.js';
import { JsonHeroRepository } from '../adapters/repositories/JsonHeroRepository.js';
import { JsonVillainRepository } from '../adapters/repositories/JsonVillainRepository.js';
import { JsonBattleRepository } from '../adapters/repositories/JsonBattleRepository.js';
import { InMemoryHeroRepository } from '../adapters/repositories/InMemoryHeroRepository.js';
import { InMemoryVillainRepository } from '../adapters/repositories/InMemoryVillainRepository.js';
import { InMemoryBattleRepository } from '../adapters/repositories/InMemoryBattleRepository.js';
import { CreateHeroUseCase } from '../../application/use-cases/CreateHeroUseCase.js';
import { GetHeroUseCase } from '../../application/use-cases/GetHeroUseCase.js';
import { ListHeroesUseCase } from '../../application/use-cases/ListHeroesUseCase.js';
import { FindHeroesByCityUseCase } from '../../application/use-cases/FindHeroesByCityUseCase.js';
import { UpdateHeroUseCase } from '../../application/use-cases/UpdateHeroUseCase.js';
import { DeleteHeroUseCase } from '../../application/use-cases/DeleteHeroUseCase.js';
import { CreateVillainUseCase } from '../../application/use-cases/CreateVillainUseCase.js';
import { GetVillainUseCase } from '../../application/use-cases/GetVillainUseCase.js';
import { ListVillainsUseCase } from '../../application/use-cases/ListVillainsUseCase.js';
import { FindVillainsByCityUseCase } from '../../application/use-cases/FindVillainsByCityUseCase.js';
import { UpdateVillainUseCase } from '../../application/use-cases/UpdateVillainUseCase.js';
import { DeleteVillainUseCase } from '../../application/use-cases/DeleteVillainUseCase.js';
import { CreateBattleUseCase } from '../../application/use-cases/CreateBattleUseCase.js';
import { GetBattleUseCase } from '../../application/use-cases/GetBattleUseCase.js';
import { ListBattlesUseCase } from '../../application/use-cases/ListBattlesUseCase.js';
import { ListBattlesByHeroUseCase } from '../../application/use-cases/ListBattlesByHeroUseCase.js';
import { ListBattlesByVillainUseCase } from '../../application/use-cases/ListBattlesByVillainUseCase.js';
import { JsonTeamBattleRepository } from '../adapters/repositories/JsonTeamBattleRepository.js';
import { InMemoryTeamBattleRepository } from '../adapters/repositories/InMemoryTeamBattleRepository.js';
import { CreateTeamBattleUseCase } from '../../application/use-cases/CreateTeamBattleUseCase.js';
import { GetTeamBattleUseCase } from '../../application/use-cases/GetTeamBattleUseCase.js';
import { ListTeamBattlesUseCase } from '../../application/use-cases/ListTeamBattlesUseCase.js';
import { ListTeamBattlesByHeroUseCase } from '../../application/use-cases/ListTeamBattlesByHeroUseCase.js';
import { ListTeamBattlesByVillainUseCase } from '../../application/use-cases/ListTeamBattlesByVillainUseCase.js';
import { DeleteTeamBattleUseCase } from '../../application/use-cases/DeleteTeamBattleUseCase.js';
import { GetTeamBattleStateUseCase } from '../../application/use-cases/GetTeamBattleStateUseCase.js';
import { UpdateTeamBattleUseCase } from '../../application/use-cases/UpdateTeamBattleUseCase.js';
 import { RestartTeamBattleUseCase } from '../../application/use-cases/RestartTeamBattleUseCase.js';
 import { PerformRoundUseCase } from '../../application/use-cases/PerformRoundUseCase.js';
import { HeroController } from '../adapters/controllers/hero.controller.js';
import { VillainController } from '../adapters/controllers/villain.controller.js';
import { BattleController } from '../adapters/controllers/battle.controller.js';
import { TeamBattleController } from '../adapters/controllers/TeamBattleController.js';
import routesConfig from './routes.config.js';
import { SwaggerConfig } from './swagger.config.js';
import express from 'express';
import path from 'path';
import { PerformAttackUseCase } from '../../application/use-cases/PerformAttackUseCase.js';
import { TeamBattleService } from '../../domain/services/TeamBattleService.js';

/**
 * Crea y configura el servidor Express con rutas y middleware.
 * @returns {ServerConfig} Instancia de ServerConfig con app y start().
 */
export function createApp() {
  const server = new ServerConfig();
  server.validateEnvironment();
  server.setupMiddleware();

  const isTestEnv = process.env.NODE_ENV === 'test';
  const heroRepo = isTestEnv ? new InMemoryHeroRepository() : new JsonHeroRepository();
  const villainRepo = isTestEnv ? new InMemoryVillainRepository() : new JsonVillainRepository();
  const battleRepo = isTestEnv ? new InMemoryBattleRepository() : new JsonBattleRepository();
  const teamBattleRepo = isTestEnv ? new InMemoryTeamBattleRepository() : new JsonTeamBattleRepository();

  // Swagger docs
  const swagger = new SwaggerConfig();
  swagger.setup(server.app);

  // Use cases
  const createHeroUseCase = new CreateHeroUseCase(heroRepo);
  const getHeroUseCase = new GetHeroUseCase(heroRepo);
  const listHeroesUseCase = new ListHeroesUseCase(heroRepo);
  const findHeroesByCityUseCase = new FindHeroesByCityUseCase(heroRepo);
  const updateHeroUseCase = new UpdateHeroUseCase(heroRepo);
  const deleteHeroUseCase = new DeleteHeroUseCase(heroRepo);

  const createVillainUseCase = new CreateVillainUseCase(villainRepo);
  const getVillainUseCase = new GetVillainUseCase(villainRepo);
  const listVillainsUseCase = new ListVillainsUseCase(villainRepo);
  const findVillainsByCityUseCase = new FindVillainsByCityUseCase(villainRepo);
  const updateVillainUseCase = new UpdateVillainUseCase(villainRepo);
  const deleteVillainUseCase = new DeleteVillainUseCase(villainRepo);

  const createBattleUseCase = new CreateBattleUseCase(battleRepo, heroRepo, villainRepo);
  const getBattleUseCase = new GetBattleUseCase(battleRepo);
  const listBattlesUseCase = new ListBattlesUseCase(battleRepo);
  const listBattlesByHeroUseCase = new ListBattlesByHeroUseCase(battleRepo);
  const listBattlesByVillainUseCase = new ListBattlesByVillainUseCase(battleRepo);

  const createTeamBattleUseCase = new CreateTeamBattleUseCase(teamBattleRepo, heroRepo, villainRepo);
  const getTeamBattleUseCase = new GetTeamBattleUseCase(teamBattleRepo);
  const listTeamBattlesUseCase = new ListTeamBattlesUseCase(teamBattleRepo);
  const listTeamBattlesByHeroUseCase = new ListTeamBattlesByHeroUseCase(teamBattleRepo);
  const listTeamBattlesByVillainUseCase = new ListTeamBattlesByVillainUseCase(teamBattleRepo);
  const deleteTeamBattleUseCase = new DeleteTeamBattleUseCase(teamBattleRepo);
  const getTeamBattleStateUseCase = new GetTeamBattleStateUseCase(teamBattleRepo);
  const updateTeamBattleUseCase = new UpdateTeamBattleUseCase(teamBattleRepo, heroRepo, villainRepo);
  const restartTeamBattleUseCase = new RestartTeamBattleUseCase(teamBattleRepo, heroRepo, villainRepo);
  const performRoundUseCase = new PerformRoundUseCase(teamBattleRepo);
  const performAttackUseCase = new PerformAttackUseCase({
    teamBattleRepository: teamBattleRepo,
    heroRepository: heroRepo,
    villainRepository: villainRepo
  });

  // Controllers
  const teamBattleController = new TeamBattleController({
    createTeamBattleUseCase,
    getTeamBattleUseCase,
    listTeamBattlesUseCase,
    listTeamBattlesByHeroUseCase,
    listTeamBattlesByVillainUseCase,
    deleteTeamBattleUseCase,
    getTeamBattleStateUseCase,
    updateTeamBattleUseCase,
    restartTeamBattleUseCase,
    performRoundUseCase,
    performAttackUseCase
  });
  const heroController = new HeroController({ createHeroUseCase, getHeroUseCase, listHeroesUseCase, findHeroesByCityUseCase, updateHeroUseCase, deleteHeroUseCase });
  const villainController = new VillainController({ createVillainUseCase, getVillainUseCase, listVillainsUseCase, findVillainsByCityUseCase, updateVillainUseCase, deleteVillainUseCase });
  const battleController = new BattleController({ createBattleUseCase, getBattleUseCase, listBattlesUseCase, listBattlesByHeroUseCase, listBattlesByVillainUseCase });

  // Rutas
  const routes = routesConfig({ hero: heroController, villain: villainController, battle: battleController, teamBattle: teamBattleController }, server.app);
  server.setupRoutes(routes);
  server.setupErrorHandling();

  // ...existing code...

  return server;
}
