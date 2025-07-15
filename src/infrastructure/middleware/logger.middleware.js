import morgan from 'morgan';

export const LoggerMiddleware = {
  detailed: () => morgan('dev'),
  basic: () => morgan('tiny'),
  error: () => (err, req, res, next) => {
    // Aquí se podría loggear a archivo
    next(err);
  },
};
