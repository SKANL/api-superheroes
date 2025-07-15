import cors from 'cors';
export const CorsMiddleware = {
  permissive: () => cors(),
  fromEnvironment: () =>
    cors({ origin: process.env.CORS_ORIGINS?.split(',') || '*' }),
};
