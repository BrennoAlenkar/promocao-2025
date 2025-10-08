import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController';

const router = Router();
const usuarioController = new UsuarioController();

// Rotas de autenticação
router.post('/login', usuarioController.login);
router.post('/register', usuarioController.register);

// Rotas protegidas (simuladas - em produção usaria middleware de auth)
router.get('/profile', usuarioController.profile);
router.get('/', usuarioController.listarUsuarios);

export { router as usuarioRoutes };