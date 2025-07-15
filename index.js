// Entry point for Superhero API with Clean Architecture
import 'dotenv/config';
import { createApp } from './src/infrastructure/config/app.js';

// Initialize server
const server = createApp();

// Export app for testing
export const app = server.app;

// Start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  await server.start();
}