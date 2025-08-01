
import cors from 'cors';

function getAllowedOrigins() {
  // Permitir orígenes desde variable de entorno o lista por defecto
  const envOrigins = process.env.CORS_ORIGINS || '';
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://127.0.0.1:5500',
    'https://rad-lokum-44254c.netlify.app',
  ];
  const origins = envOrigins
    ? envOrigins.split(',').map(o => o.trim())
    : defaultOrigins;
  
  console.log('CORS: Variable de entorno CORS_ORIGINS:', envOrigins);
  console.log('CORS: Orígenes permitidos:', origins);
  
  return origins;
}

export const CorsMiddleware = {
  permissive: () => cors({
    origin: (origin, callback) => {
      const allowedOrigins = getAllowedOrigins();
      // Permitir requests sin origen (como Postman) o si el origen está en la lista
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS: Origen no permitido: ${origin}`);
        console.log(`CORS: Orígenes permitidos:`, allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
  fromEnvironment: () => cors({
    origin: (origin, callback) => {
      const allowedOrigins = getAllowedOrigins();
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS: Origen no permitido: ${origin}`);
        console.log(`CORS: Orígenes permitidos:`, allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
};
