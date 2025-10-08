import { Router } from 'express';
import { promocaoRoutes } from './promocaoRoutes';
import { usuarioRoutes } from './usuarioRoutes';
import { ganhadorRoutes } from './ganhadorRoutes';
import { lojaRoutes } from './lojaRoutes';
import { authRoutes } from './authRoutes';

const router = Router();

// Rota de saúde da API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API de Promoções funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rotas da aplicação
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/promocoes', promocaoRoutes);
router.use('/ganhadores', ganhadorRoutes);
router.use('/lojas', lojaRoutes);

export { router as apiRoutes };