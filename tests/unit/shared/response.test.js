import * as response from '../../../src/shared/utils/response.js';

describe('response utils', () => {
  it('debe exponer success y error', () => {
    expect(typeof response.success).toBe('function');
    expect(typeof response.error).toBe('function');
  });
});
