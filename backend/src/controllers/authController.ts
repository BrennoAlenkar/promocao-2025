import { Request, Response } from 'express';
import { generateToken } from '../middlewares/auth';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Simulação de validação (em produção, você validaria com banco de dados)
      if (email === 'admin@superpromo2025.com' && password === 'admin123') {
        const token = generateToken({
          id: '1',
          email: email,
          role: 'admin'
        });

        res.json({
          success: true,
          data: {
            token,
            user: {
              id: '1',
              email: email,
              role: 'admin'
            }
          },
          message: 'Login realizado com sucesso'
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  async validateToken(req: Request, res: Response) {
    try {
      // Se chegou até aqui, o token é válido (middleware auth executou)
      res.json({
        success: true,
        data: {
          user: (req as any).user
        },
        message: 'Token válido'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}