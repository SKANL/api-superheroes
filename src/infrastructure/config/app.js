import 'dotenv/config';
import { ServerConfig } from './server.config.js';
import { JsonHeroRepository } from '../adapters/repositories/JsonHeroRepository.js';
import { JsonVillainRepository } from '../adapters/repositories/JsonVillainRepository.js';
import { JsonBattleRepository } from '../adapters/repositories/JsonBattleRepository.js';
import { MongoHeroRepository } from '../adapters/repositories/MongoHeroRepository.js';
import { MongoVillainRepository } from '../adapters/repositories/MongoVillainRepository.js';
import { MongoBattleRepository } from '../adapters/repositories/MongoBattleRepository.js';
import { MongoTeamBattleRepository } from '../adapters/repositories/MongoTeamBattleRepository.js';
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
import { PerformBattleAttackUseCase } from '../../application/use-cases/PerformBattleAttackUseCase.js';
import { FinishBattleUseCase } from '../../application/use-cases/FinishBattleUseCase.js';
import { JsonTeamBattleRepository } from '../adapters/repositories/JsonTeamBattleRepository.js';
import { MongoUserRepository } from '../adapters/repositories/MongoUserRepository.js';
import { InMemoryUserRepository } from '../adapters/repositories/InMemoryUserRepository.js';
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
import { CityController } from '../adapters/controllers/city.controller.js';
import { SwaggerConfig } from './swagger.config.js';
import { MongoDBConfig } from './mongodb.config.js';
import express from 'express';
import path from 'path';
import { PerformAttackUseCase } from '../../application/use-cases/PerformAttackUseCase.js';
import { TeamBattleService } from '../../domain/services/TeamBattleService.js';
import { RegisterUserUseCase } from '../../application/use-cases/auth/RegisterUserUseCase.js';
import { LoginUserUseCase } from '../../application/use-cases/auth/LoginUserUseCase.js';
import { GetUserProfileUseCase } from '../../application/use-cases/auth/GetUserProfileUseCase.js';
import { AuthController } from '../adapters/controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { ownershipMiddlewareFactory } from '../middleware/ownership.middleware.js';
import { ValidateBattleOwnershipUseCase } from '../../application/use-cases/ValidateBattleOwnershipUseCase.js';
import { ValidateTeamBattleOwnershipUseCase } from '../../application/use-cases/ValidateTeamBattleOwnershipUseCase.js';
import { ValidateHeroOwnershipUseCase } from '../../application/use-cases/ValidateHeroOwnershipUseCase.js';
import { ValidateVillainOwnershipUseCase } from '../../application/use-cases/ValidateVillainOwnershipUseCase.js';

/**
 * Crea y configura el servidor Express con rutas y middleware.
 * @returns {ServerConfig} Instancia de ServerConfig con app y start().
 */
export function createApp() {
  const server = new ServerConfig();
  server.validateEnvironment();
  server.setupMiddleware();

  const isTestEnv = process.env.NODE_ENV === 'test';
  // Repositorios de dominio
  const heroRepo = isTestEnv
    ? new InMemoryHeroRepository()
    : process.env.DB_TYPE === 'mongodb'
      ? new MongoHeroRepository()
      : new JsonHeroRepository();
  const villainRepo = isTestEnv
    ? new InMemoryVillainRepository()
    : process.env.DB_TYPE === 'mongodb'
      ? new MongoVillainRepository()
      : new JsonVillainRepository();
  const battleRepo = isTestEnv
    ? new InMemoryBattleRepository()
    : process.env.DB_TYPE === 'mongodb'
      ? new MongoBattleRepository()
      : new JsonBattleRepository();
  const teamBattleRepo = isTestEnv
    ? new InMemoryTeamBattleRepository()
    : process.env.DB_TYPE === 'mongodb'
      ? new MongoTeamBattleRepository()
      : new JsonTeamBattleRepository();
  const userRepo = isTestEnv
    ? new InMemoryUserRepository()
    : new MongoUserRepository();

  // Swagger docs
  const swagger = new SwaggerConfig();
  swagger.setup(server.app);

  // Use cases
  // Autenticación
  const registerUserUseCase = new RegisterUserUseCase(userRepo);
  const loginUserUseCase = new LoginUserUseCase(userRepo);
  const getUserProfileUseCase = new GetUserProfileUseCase(userRepo);
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
  const performBattleAttackUseCase = new PerformBattleAttackUseCase({ battleRepository: battleRepo });
  const finishBattleUseCase = new FinishBattleUseCase({ battleRepository: battleRepo });

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

  // Ownership middleware factory con todos los repositorios
  const ownershipMiddleware = ownershipMiddlewareFactory({
    battleRepository: battleRepo,
    teamBattleRepository: teamBattleRepo,
    heroRepository: heroRepo,
    villainRepository: villainRepo
  });

  // Controllers
  const authController = new AuthController({
    registerUserUseCase,
    loginUserUseCase,
    getUserProfileUseCase
  });
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
  const battleController = new BattleController({
    createBattleUseCase,
    getBattleUseCase,
    listBattlesUseCase,
    listBattlesByHeroUseCase,
    listBattlesByVillainUseCase,
    performBattleAttackUseCase,
    finishBattleUseCase
  });

  // Rutas
  const cityController = new CityController();
  const routes = routesConfig(
    {
      auth: authController,
      hero: heroController,
      villain: villainController,
      battle: battleController,
      teamBattle: teamBattleController,
      city: cityController
    },
    server.app,
    ownershipMiddleware
  );
  server.setupRoutes(routes);
  server.setupErrorHandling();

  // Inicializar conexión con MongoDB
  if (process.env.NODE_ENV !== 'test') {
    const mongodb = new MongoDBConfig();
    mongodb.connect().then((connection) => {
      if (connection) {
        mongodb.setupConnectionHooks();
        console.log('🚀 Sistema listo con base de datos MongoDB');
      } else {
        console.log('⚠️ Sistema funcionando en modo degradado (sin base de datos)');
        console.log('   Algunas funcionalidades no estarán disponibles');
      }
    }).catch(err => {
      console.error('❌ Error crítico con MongoDB:', err);
    });
  }

  return server;
}
