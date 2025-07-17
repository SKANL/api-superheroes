import mongoose from 'mongoose';

/**
 * Conecta a MongoDB usando Mongoose.
 * Usa la URI definida en la variable de entorno MONGODB_URI.
 */
export async function connectMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI no está definida en .env');
  }
  await mongoose.connect(uri, {
    maxPoolSize: parseInt(process.env.DB_POOL_SIZE, 10) || 10,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ Conectado a MongoDB');
}
