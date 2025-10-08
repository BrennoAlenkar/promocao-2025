import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { connectDatabase } from './utils/database';
import { apiRoutes } from './routes';
import { errorHandler, notFound } from './middlewares/errorHandler';
import { seedDatabase } from './models/seedData';
import { swaggerUi, specs } from './swagger';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de segurança
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    success: false,
    message: 'Muitas tentativas. Tente novamente em 15 minutos.'
  }
});
app.use(limiter);

// Middlewares básicos
const allowedOrigins = process.env.CORS_ORIGIN ? 
  process.env.CORS_ORIGIN.split(',') : 
  ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware para logs de requisições em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Documentação Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customSiteTitle: 'Super Promoção 2025 API',
  customCss: '.swagger-ui .topbar { display: none }',
  customfavIcon: '/favicon.ico'
}));

// Rotas
app.use('/api/v1', apiRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Promoções - Backend',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      ganhadores: '/api/v1/ganhadores',
      lojas: '/api/v1/lojas',
      docs: '/api/docs'
    }
  });
});

// Middlewares de erro
app.use(notFound);
app.use(errorHandler);

// Inicializar servidor
const startServer = async () => {
  try {
    // Conectar ao banco de dados
    await connectDatabase();
    
    // Popular banco com dados iniciais se necessário
    if (process.env.NODE_ENV === 'development') {
      try {
        await seedDatabase();
      } catch (error) {
        console.log('ℹ️  Dados já existem no banco ou MongoDB não disponível');
      }
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`❤️  API Health: http://localhost:${PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error);
    process.exit(1);
  }
};

// Tratamento de sinais para graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recebido. Encerrando servidor...');
  process.exit(0);
});

// Inicializar
startServer();

export { app };