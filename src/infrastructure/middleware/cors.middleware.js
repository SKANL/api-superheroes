import cors from 'cors';
export const CorsMiddleware = {
  permissive: () => cors(),
  fromEnvironment: () => cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'], credentials: true }),
};
