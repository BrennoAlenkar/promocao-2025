import { Request, Response } from 'express';
import { AuthResponse, LoginRequest, RegisterRequest, Usuario } from '../models/types';

// por enquanto tô usando array pra simular banco de dados
// depois vou trocar por MongoDB
let usuarios: Usuario[] = [
  {
    id: '1',
    nome: 'Usuário Demo',
    email: 'demo@exemplo.com',
    cpf: '12345678901',
    senha: 'senha123',
    telefone: '11999999999',
    ativo: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export class UsuarioController {
  
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha }: LoginRequest = req.body;

      // precisa dos dois campos
      if (!email || !senha) {
        res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios'
        });
        return;
      }

      // procura o usuário
      const usuario = usuarios.find(u => u.email === email && u.ativo);
      
      if (!usuario || usuario.senha !== senha) {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
        return;
      }

      // gera um token fake por enquanto
      const token = `fake-jwt-token-${usuario.id}-${Date.now()}`;

      // tira a senha antes de retornar
      const { senha: _, ...usuarioSemSenha } = usuario;

      const response: AuthResponse = {
        success: true,
        user: usuarioSemSenha,
        token,
        message: 'Login realizado com sucesso'
      };

      res.json(response);
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { nome, email, cpf, senha, telefone }: RegisterRequest = req.body;

      // Validar campos obrigatórios
      if (!nome || !email || !cpf || !senha) {
        res.status(400).json({
          success: false,
          message: 'Nome, email, CPF e senha são obrigatórios'
        });
        return;
      }

      // Verificar se usuário já existe
      const usuarioExistente = usuarios.find(u => u.email === email || u.cpf === cpf);
      
      if (usuarioExistente) {
        res.status(409).json({
          success: false,
          message: 'Usuário já cadastrado com este email ou CPF'
        });
        return;
      }

      // Criar novo usuário
      const novoUsuario: Usuario = {
        id: String(usuarios.length + 1),
        nome,
        email,
        cpf,
        senha,
        telefone: telefone || '',
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      usuarios.push(novoUsuario);

      // Simular geração de token JWT
      const token = `fake-jwt-token-${novoUsuario.id}-${Date.now()}`;

      // Remover senha da resposta
      const { senha: _, ...usuarioSemSenha } = novoUsuario;

      const response: AuthResponse = {
        success: true,
        user: usuarioSemSenha,
        token,
        message: 'Usuário cadastrado com sucesso'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async profile(req: Request, res: Response): Promise<void> {
    try {
      // Simular extração do usuário do token
      // Em produção, isso viria do middleware de autenticação
      const usuarioId = req.headers.authorization?.split('-')[3]; // Extrair do fake token
      
      if (!usuarioId) {
        res.status(401).json({
          success: false,
          message: 'Token inválido'
        });
        return;
      }

      const usuario = usuarios.find(u => u.id === usuarioId && u.ativo);
      
      if (!usuario) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
        return;
      }

      // Remover senha da resposta
      const { senha: _, ...usuarioSemSenha } = usuario;

      res.json({
        success: true,
        user: usuarioSemSenha
      });
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async listarUsuarios(req: Request, res: Response): Promise<void> {
    try {
      // Remover senhas da resposta
      const usuariosSemSenha = usuarios
        .filter(u => u.ativo)
        .map(({ senha, ...usuario }) => usuario);

      res.json({
        success: true,
        data: usuariosSemSenha,
        total: usuariosSemSenha.length
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}