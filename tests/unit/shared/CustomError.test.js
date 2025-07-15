import { CustomError } from '../../../src/shared/exceptions/CustomError.js';

describe('CustomError', () => {
  it('debe crear un error con mensaje y status', () => {
    const err = new CustomError('msg', 404);
    expect(err.message).toBe('msg');
    expect(err.status).toBe(404);
  });
});
