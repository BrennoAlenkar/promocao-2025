import { Router } from 'express';
import { GanhadorController } from '../controllers/ganhadorController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();
const ganhadorController = new GanhadorController();

/**
 * @swagger
 * /ganhadores:
 *   get:
 *     summary: Listar todos os ganhadores
 *     tags: [Ganhadores]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Itens por página
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Filtrar por estado (UF)
 *       - in: query
 *         name: premio
 *         schema:
 *           type: string
 *         description: Filtrar por prêmio
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome do ganhador
 *     responses:
 *       200:
 *         description: Lista de ganhadores
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Ganhador'
 */
router.get('/', ganhadorController.listarGanhadores);

/**
 * @swagger
 * /ganhadores/agregacao:
 *   get:
 *     summary: Agregação de ganhadores por estado
 *     tags: [Ganhadores]
 *     description: Retorna o total de ganhadores por estado (UF)
 *     responses:
 *       200:
 *         description: Agregação por estado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Estado (UF)
 *                           total:
 *                             type: number
 *                             description: Total de ganhadores
 */
router.get('/agregacao', ganhadorController.agregacaoPorEstado);

/**
 * @swagger
 * /ganhadores/{id}:
 *   get:
 *     summary: Buscar ganhador por ID
 *     tags: [Ganhadores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do ganhador
 *     responses:
 *       200:
 *         description: Ganhador encontrado
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Ganhador'
 *       404:
 *         description: Ganhador não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', ganhadorController.buscarGanhador);

/**
 * @swagger
 * /ganhadores:
 *   post:
 *     summary: Criar novo ganhador
 *     tags: [Ganhadores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - estado
 *               - cidade
 *               - premio
 *               - data
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Maria Silva Santos"
 *               estado:
 *                 type: string
 *                 example: "SP"
 *               cidade:
 *                 type: string
 *                 example: "São Paulo"
 *               premio:
 *                 type: string
 *                 example: "Smart TV 50 polegadas"
 *               data:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-15"
 *     responses:
 *       201:
 *         description: Ganhador criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Ganhador'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateToken, ganhadorController.criarGanhador);

/**
 * @swagger
 * /ganhadores/{id}:
 *   put:
 *     summary: Atualizar ganhador
 *     tags: [Ganhadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do ganhador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ganhador'
 *     responses:
 *       200:
 *         description: Ganhador atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Ganhador'
 *       404:
 *         description: Ganhador não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', authenticateToken, ganhadorController.atualizarGanhador);

/**
 * @swagger
 * /ganhadores/{id}:
 *   delete:
 *     summary: Excluir ganhador
 *     tags: [Ganhadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do ganhador
 *     responses:
 *       200:
 *         description: Ganhador excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Ganhador não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', authenticateToken, ganhadorController.deletarGanhador);

export { router as ganhadorRoutes };