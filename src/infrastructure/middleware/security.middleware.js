import helmet from 'helmet';
// Middleware de seguridad (helmet, headers, etc.)
export const SecurityMiddleware = {
  helmet: () => helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  }),
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
