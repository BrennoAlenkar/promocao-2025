import { Router } from 'express';
import { LojaController } from '../controllers/lojaController';

const router = Router();
const lojaController = new LojaController();

// Rotas para lojas
router.get('/', lojaController.listarLojas);
router.get('/mais-proxima', lojaController.buscarLojaMaisProxima);
router.get('/:id', lojaController.buscarLoja);
router.post('/', lojaController.criarLoja);
router.put('/:id', lojaController.atualizarLoja);
router.delete('/:id', lojaController.deletarLoja);

export { router as lojaRoutes };