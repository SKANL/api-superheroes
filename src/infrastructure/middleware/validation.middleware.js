import { body, param, validationResult } from 'express-validator';

export const ValidationMiddleware = {
  heroValidation: {
    create: [
      body('name').isString().notEmpty().withMessage('Name is required'),
      body('alias').isString().notEmpty().withMessage('Alias is required'),
      body('city').isString().notEmpty().withMessage('City is required'),
      body('team').optional().isString().withMessage('Team must be a string'),
      body('health').optional().isInt({ min: 1, max: 1000 }).toInt().withMessage('Health must be between 1 and 1000'),
      body('attack').optional().isInt({ min: 1, max: 200 }).toInt().withMessage('Attack must be between 1 and 200'),
      body('defense').optional().isInt({ min: 0, max: 200 }).toInt().withMessage('Defense must be between 0 and 200'),
      body('specialAbility').optional().isString().withMessage('Special ability must be a string'),
      body('isAlive').optional().isBoolean().toBoolean().withMessage('isAlive must be a boolean'),
      body('roundsWon').optional().isInt({ min: 0, max: 1000 }).toInt().withMessage('Rounds won must be between 0 and 1000'),
      body('damage').optional().isInt({ min: 0, max: 1000 }).toInt().withMessage('Damage must be between 0 and 1000'),
      body('status').optional().isIn(['normal', 'congelado', 'envenenado', 'fortalecido', 'debilitado', 'paralizado']).withMessage('Status must be valid'),
      body('stamina').optional().isInt({ min: 0, max: 200 }).toInt().withMessage('Stamina must be between 0 and 200'),
      body('speed').optional().isInt({ min: 1, max: 200 }).toInt().withMessage('Speed must be between 1 and 200'),
      body('critChance').optional().isInt({ min: 0, max: 100 }).toInt().withMessage('Crit chance must be between 0 and 100'),
      body('teamAffinity').optional().isInt({ min: -100, max: 100 }).toInt().withMessage('Team affinity must be between -100 and 100'),
      body('energyCost').optional().isInt({ min: 0, max: 100 }).toInt().withMessage('Energy cost must be between 0 and 100'),
      body('damageReduction').optional().isInt({ min: 0, max: 100 }).toInt().withMessage('Damage reduction must be between 0 and 100'),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      },
    ],
    update: [
      param('id').isString().notEmpty(),
      body('name').optional().isString(),
      body('alias').optional().isString(),
      body('city').optional().isString(),
      body('team').optional().isString(),
      body('health').optional().isInt({ min: 1, max: 1000 }).withMessage('Health must be between 1 and 1000'),
      body('attack').optional().isInt({ min: 1, max: 200 }).withMessage('Attack must be between 1 and 200'),
      body('defense').optional().isInt({ min: 0, max: 200 }).withMessage('Defense must be between 0 and 200'),
      body('specialAbility').optional().isString().withMessage('Special ability must be a string'),
      body('isAlive').optional().isBoolean().withMessage('isAlive must be a boolean'),
      body('roundsWon').optional().isInt({ min: 0, max: 1000 }).withMessage('Rounds won must be between 0 and 1000'),
      body('damage').optional().isInt({ min: 0, max: 1000 }).withMessage('Damage must be between 0 and 1000'),
      body('status').optional().isIn(['normal', 'congelado', 'envenenado', 'fortalecido', 'debilitado', 'paralizado']).withMessage('Status must be valid'),
      body('stamina').optional().isInt({ min: 0, max: 200 }).withMessage('Stamina must be between 0 and 200'),
      body('speed').optional().isInt({ min: 1, max: 200 }).withMessage('Speed must be between 1 and 200'),
      body('critChance').optional().isInt({ min: 0, max: 100 }).withMessage('Crit chance must be between 0 and 100'),
      body('teamAffinity').optional().isInt({ min: -100, max: 100 }).withMessage('Team affinity must be between -100 and 100'),
      body('energyCost').optional().isInt({ min: 0, max: 100 }).withMessage('Energy cost must be between 0 and 100'),
      body('damageReduction').optional().isInt({ min: 0, max: 100 }).withMessage('Damage reduction must be between 0 and 100'),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      },
    ],
  },

  villainValidation: {
    create: [
      body('name').isString().notEmpty().withMessage('Name is required'),
      body('alias').isString().notEmpty().withMessage('Alias is required'),
      body('city').isString().notEmpty().withMessage('City is required'),
      body('team').optional().isString().withMessage('Team must be a string'),
      body('health').optional().isInt({ min: 1, max: 1000 }).toInt().withMessage('Health must be between 1 and 1000'),
      body('attack').optional().isInt({ min: 1, max: 200 }).toInt().withMessage('Attack must be between 1 and 200'),
      body('defense').optional().isInt({ min: 0, max: 200 }).toInt().withMessage('Defense must be between 0 and 200'),
      body('specialAbility').optional().isString().withMessage('Special ability must be a string'),
      body('isAlive').optional().isBoolean().toBoolean().withMessage('isAlive must be a boolean'),
      body('roundsWon').optional().isInt({ min: 0, max: 1000 }).toInt().withMessage('Rounds won must be between 0 and 1000'),
      body('damage').optional().isInt({ min: 0, max: 1000 }).toInt().withMessage('Damage must be between 0 and 1000'),
      body('status').optional().isIn(['normal', 'congelado', 'envenenado', 'fortalecido', 'debilitado', 'paralizado']).withMessage('Status must be valid'),
      body('stamina').optional().isInt({ min: 0, max: 200 }).toInt().withMessage('Stamina must be between 0 and 200'),
      body('speed').optional().isInt({ min: 1, max: 200 }).toInt().withMessage('Speed must be between 1 and 200'),
      body('critChance').optional().isInt({ min: 0, max: 100 }).toInt().withMessage('Crit chance must be between 0 and 100'),
      body('teamAffinity').optional().isInt({ min: -100, max: 100 }).toInt().withMessage('Team affinity must be between -100 and 100'),
      body('energyCost').optional().isInt({ min: 0, max: 100 }).toInt().withMessage('Energy cost must be between 0 and 100'),
      body('damageReduction').optional().isInt({ min: 0, max: 100 }).toInt().withMessage('Damage reduction must be between 0 and 100'),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      },
    ],
    update: [
      param('id').isString().notEmpty(),
      body('name').optional().isString(),
      body('alias').optional().isString(),
      body('city').optional().isString(),
      body('team').optional().isString().withMessage('Team must be a string'),
      body('health').optional().isInt({ min: 1, max: 1000 }).withMessage('Health must be between 1 and 1000'),
      body('attack').optional().isInt({ min: 1, max: 200 }).withMessage('Attack must be between 1 and 200'),
      body('defense').optional().isInt({ min: 0, max: 200 }).withMessage('Defense must be between 0 and 200'),
      body('specialAbility').optional().isString().withMessage('Special ability must be a string'),
      body('isAlive').optional().isBoolean().withMessage('isAlive must be a boolean'),
      body('roundsWon').optional().isInt({ min: 0, max: 1000 }).withMessage('Rounds won must be between 0 and 1000'),
      body('damage').optional().isInt({ min: 0, max: 1000 }).withMessage('Damage must be between 0 and 1000'),
      body('status').optional().isIn(['normal', 'congelado', 'envenenado', 'fortalecido', 'debilitado', 'paralizado']).withMessage('Status must be valid'),
      body('stamina').optional().isInt({ min: 0, max: 200 }).withMessage('Stamina must be between 0 and 200'),
      body('speed').optional().isInt({ min: 1, max: 200 }).withMessage('Speed must be between 1 and 200'),
      body('critChance').optional().isInt({ min: 0, max: 100 }).withMessage('Crit chance must be between 0 and 100'),
      body('teamAffinity').optional().isInt({ min: -100, max: 100 }).withMessage('Team affinity must be between -100 and 100'),
      body('energyCost').optional().isInt({ min: 0, max: 100 }).withMessage('Energy cost must be between 0 and 100'),
      body('damageReduction').optional().isInt({ min: 0, max: 100 }).withMessage('Damage reduction must be between 0 and 100'),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      },
    ],
  },

  battleValidation: {
    create: [
      body('heroId').isString().notEmpty().withMessage('heroId is required'),
      body('villainId').isString().notEmpty().withMessage('villainId is required'),
      body('location').optional().isString().withMessage('location must be a string'),
      body('mode').optional().isIn(['manual','auto']).withMessage('mode must be "manual" or "auto"'),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      },
    ],
    idParam: [
      param('id').isString().notEmpty().withMessage('id is required'),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      },
    ],
  },

  teamBattleValidation: {
    create: [
      body('heroIds').isArray().withMessage('heroIds must be an array'),
      body('heroIds')
        .custom(arr => arr.length > 0)
        .withMessage('heroIds must be non-empty'),
      body('villainIds').isArray().withMessage('villainIds must be an array'),
      body('villainIds')
        .custom(arr => arr.length > 0)
        .withMessage('villainIds must be non-empty'),
      body('mode').optional().isString().withMessage('mode must be a string'),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      },
    ],
    update: [
      param('id').isString().notEmpty().withMessage('id is required'),
      body('heroIds')
        .optional()
        .isArray()
        .withMessage('heroIds must be an array'),
      body('heroIds')
        .optional()
        .custom(arr => arr.length > 0)
        .withMessage('heroIds must be non-empty'),
      body('villainIds')
        .optional()
        .isArray()
        .withMessage('villainIds must be an array'),
      body('villainIds')
        .optional()
        .custom(arr => arr.length > 0)
        .withMessage('villainIds must be non-empty'),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(400).json({ errors: errors.array() });
        next();
      },
    ],
    idParam: [
      param('id').isString().notEmpty().withMessage('id is required'),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(400).json({ errors: errors.array() });
        next();
      },
    ],
  },
};

export const heroValidation = ValidationMiddleware.heroValidation;
export const villainValidation = ValidationMiddleware.villainValidation;
export const battleValidation = ValidationMiddleware.battleValidation;
export const teamBattleValidation = ValidationMiddleware.teamBattleValidation;
