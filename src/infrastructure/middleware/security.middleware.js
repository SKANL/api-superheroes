import helmet from 'helmet';
// Middleware de seguridad (helmet, headers, etc.)
export const SecurityMiddleware = {
  helmet: () => helmet(),
  securityHeaders: () => (req, res, next) => {
    next();
  },
  xssProtection: () => (req, res, next) => {
    next();
  },
  validateContentType: types => (req, res, next) => {
    next();
  },
  validateUserAgent: () => (req, res, next) => {
    next();
  },
};
