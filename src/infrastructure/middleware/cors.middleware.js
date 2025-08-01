
import cors from 'cors';

export const CorsMiddleware = {
  permissive: () => cors({
    origin: true, // Permitir todos los orígenes
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
  fromEnvironment: () => cors({
    origin: true, // Permitir todos los orígenes  
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
};
