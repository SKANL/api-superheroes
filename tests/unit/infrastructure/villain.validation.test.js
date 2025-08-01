import { villainValidation } from '../../../src/infrastructure/middleware/validation.middleware.js';
import { validationResult } from 'express-validator';
import { jest } from '@jest/globals';

describe('Villain Validation Middleware', () => {
  it('should return 400 if name is missing', async () => {
    const req = { body: { alias: 'A', city: 'B' }, params: {}, method: 'POST' };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    await villainValidation.create[0](req, res, next); // body('name')
    // No error yet, validationResult is checked in the last middleware
    // Now there are 16 validation rules + 1 final middleware = index 16
    await villainValidation.create[16](req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
