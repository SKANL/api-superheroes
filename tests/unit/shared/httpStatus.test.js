import httpStatus from '../../../src/shared/constants/httpStatus.js';

describe('httpStatus', () => {
  it('debe tener códigos estándar', () => {
    expect(httpStatus.OK).toBe(200);
    expect(httpStatus.NOT_FOUND).toBe(404);
  });
});
