
import cors from 'cors';

function getAllowedOrigins() {
  // Permitir orígenes desde variable de entorno o lista por defecto
  const envOrigins = process.env.CORS_ORIGINS || '';
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
  ];
  const origins = envOrigins
    ? envOrigins.split(',').map(o => o.trim())
    : defaultOrigins;
  return origins;
}

export const CorsMiddleware = {
  permissive: () => cors({
    origin: getAllowedOrigins(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
  fromEnvironment: () => cors({
    origin: getAllowedOrigins(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
};
