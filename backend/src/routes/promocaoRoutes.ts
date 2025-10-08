import { Router } from 'express';
import { PromocaoController } from '../controllers/promocaoController';
import { 
  validateCreatePromocao, 
  validateUpdatePromocao, 
  validateId,
  validateListQuery 
} from '../middlewares/validation';
import { handleValidationErrors } from '../middlewares/validateRequest';

const router = Router();
const promocaoController = new PromocaoController();

// Rotas para promoções
router.post(
  '/',
  validateCreatePromocao,
  handleValidationErrors,
  promocaoController.criarPromocao
);

router.get(
  '/',
  validateListQuery,
  handleValidationErrors,
  promocaoController.listarPromocoes
);

router.get(
  '/:id',
  validateId,
  handleValidationErrors,
  promocaoController.buscarPromocao
);

router.put(
  '/:id',
  validateUpdatePromocao,
  handleValidationErrors,
  promocaoController.atualizarPromocao
);

router.delete(
  '/:id',
  validateId,
  handleValidationErrors,
  promocaoController.deletarPromocao
);

// Rotas especiais
router.get(
  '/produto/:produtoId',
  validateId,
  handleValidationErrors,
  promocaoController.buscarPromocoesPorProduto
);

router.get(
  '/categoria/:categoriaId',
  validateId,
  handleValidationErrors,
  promocaoController.buscarPromocoesPorCategoria
);

router.post(
  '/aplicar',
  handleValidationErrors,
  promocaoController.aplicarPromocao
);

router.post(
  '/calcular-desconto',
  handleValidationErrors,
  promocaoController.calcularDesconto
);

export { router as promocaoRoutes };