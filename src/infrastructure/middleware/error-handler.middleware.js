// Middleware de manejo de errores
export const ErrorHandlerMiddleware = {
  notFound: () => (req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
  },
  handle: () => (err, req, res, next) => {
    res
      .status(err.status || 500)
      .json({ error: err.message || 'Internal Server Error' });
  },
};
