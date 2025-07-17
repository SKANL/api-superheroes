// MongoDB Configuration for Clean Architecture
import mongoose from 'mongoose';
// MongoDBConfig utiliza variables de entorno cargadas en app.js (import 'dotenv/config' en app.js)

export class MongoDBConfig {
  constructor() {
    this.uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/superheroes-api';
    this.options = {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    };
  }

  async connect() {
    try {
      mongoose.set('strictQuery', false);
      const connection = await mongoose.connect(this.uri, this.options);
      console.log(`✅ Conectado a MongoDB: ${connection.connection.host}`);
      return connection;
    } catch (error) {
      console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
      console.log(`URI utilizada: ${this.uri.replace(/\/\/(.+?):(.+?)@/, '//***:***@')}`); // Oculta credenciales
      console.log('Comprueba que MongoDB está en ejecución y que la URI es correcta');
      
      if (this.uri.includes('mongodb+srv')) {
        console.log('Parece que estás usando MongoDB Atlas. Asegúrate de que tu IP está en la lista blanca.');
      } else if (this.uri.includes('localhost')) {
        console.log('Parece que estás usando MongoDB local. Asegúrate de que el servicio está iniciado.');
      }
      
      // No salimos del proceso para permitir que la aplicación siga funcionando
      // en modo degradado (puede servir rutas estáticas, etc.)
      return null;
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log('MongoDB disconnected');
    } catch (error) {
      console.error(`MongoDB disconnection error: ${error.message}`);
    }
  }

  // Método para establecer hooks de conexión
  setupConnectionHooks() {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Gestionar cierres de aplicación apropiadamente
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
  }
}

export default MongoDBConfig;
