// Entry point for Superhero API with Clean Architecture
import 'dotenv/config';
import { createApp } from './src/infrastructure/config/app.js';

// Initialize server
const server = createApp();

// Export app for testing
export const app = server.app;

// Start server: conectar a MongoDB si aplica y luego iniciar
if (process.env.NODE_ENV !== 'test') {
  if (process.env.DB_TYPE === 'mongodb') {
    // Conexión a MongoDB
    const { connectMongoDB } = await import('./src/infrastructure/config/mongoose.config.js');
    await connectMongoDB();
  }
  await server.start();
}