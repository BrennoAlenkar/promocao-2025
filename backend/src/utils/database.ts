import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/promocoes';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log('✅ Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar com o MongoDB:', error);
    // Em desenvolvimento, continuar sem MongoDB se não estiver disponível
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Continuando em modo desenvolvimento sem MongoDB...');
      return;
    }
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('🔌 Desconectado do MongoDB');
  } catch (error) {
    console.error('❌ Erro ao desconectar do MongoDB:', error);
  }
};

// Event listeners para conexão
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose conectado ao MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🚨 Erro na conexão do Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📴 Mongoose desconectado');
});