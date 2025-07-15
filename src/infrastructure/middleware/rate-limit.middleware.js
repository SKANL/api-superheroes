import rateLimit from 'express-rate-limit';
export const rateLimitInstance = {
  basic: opts => rateLimit({ windowMs: opts.windowMs, max: opts.maxRequests }),
  strict: opts => rateLimit({ windowMs: opts.windowMs, max: opts.maxRequests }),
  getStats: () => ({}),
};
