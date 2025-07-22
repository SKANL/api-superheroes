// Script para limpiar todas las colecciones de la base de datos MongoDB
import 'dotenv/config';
import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  console.error('No se encontró la URI de MongoDB en las variables de entorno');
  process.exit(1);
}

async function cleanDatabase() {
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    if (db.name !== 'test') {
      console.error(`¡Precaución! La base de datos conectada es '${db.name}', no 'test'. Abortando para evitar pérdida de datos.`);
      await mongoose.disconnect();
      process.exit(1);
    }
    const collections = await db.db.listCollections().toArray();
    for (const col of collections) {
      await db.collection(col.name).deleteMany({});
      console.log(`Colección '${col.name}' limpiada.`);
    }
    await mongoose.disconnect();
    console.log('✅ Base de datos MongoDB (test) limpia.');
  } catch (err) {
    console.error('Error al limpiar la base de datos:', err);
    process.exit(1);
  }
}

cleanDatabase();
