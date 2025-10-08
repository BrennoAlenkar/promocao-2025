import { Request, Response } from 'express';
import { AgregacaoEstado } from '../models/types';
import { GanhadorModel } from '../models/schemas';

export class GanhadorController {

  async listarGanhadores(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, estado, premio, nome } = req.query;
      
      // Construir filtros
      const filtros: any = {};
      
      if (estado) {
        filtros.estado = new RegExp(estado as string, 'i');
      }
      
      if (premio) {
        filtros.premio = new RegExp(premio as string, 'i');
      }
      
      if (nome) {
        filtros.nome = new RegExp(nome as string, 'i');
      }

      // Paginação
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Buscar ganhadores com filtros e paginação
      const ganhadores = await GanhadorModel
        .find(filtros)
        .sort({ data: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

      // Contar total de documentos
      const total = await GanhadorModel.countDocuments(filtros);
      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: ganhadores,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages
        },
        message: 'Ganhadores recuperados com sucesso'
      });
    } catch (error) {
      console.error('Erro ao listar ganhadores:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async buscarGanhador(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const ganhador = await GanhadorModel.findById(id).lean();
      
      if (!ganhador) {
        return res.status(404).json({
          success: false,
          message: 'Ganhador não encontrado'
        });
      }

      res.json({
        success: true,
        data: ganhador,
        message: 'Ganhador encontrado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar ganhador:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async criarGanhador(req: Request, res: Response) {
    try {
      const { nome, estado, cidade, premio, data } = req.body;

      // Validações básicas
      if (!nome || !estado || !cidade || !premio) {
        return res.status(400).json({
          success: false,
          message: 'Nome, estado, cidade e prêmio são obrigatórios'
        });
      }

      const novoGanhador = new GanhadorModel({
        nome,
        estado: estado.toUpperCase(),
        cidade,
        premio,
        data: data ? new Date(data) : new Date()
      });

      const ganhadorSalvo = await novoGanhador.save();

      res.status(201).json({
        success: true,
        data: ganhadorSalvo,
        message: 'Ganhador criado com sucesso'
      });
    } catch (error: any) {
      console.error('Erro ao criar ganhador:', error);
      
      // Tratar erros de validação do Mongoose
      if (error.name === 'ValidationError') {
        const mensagens = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: mensagens
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async atualizarGanhador(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, estado, cidade, premio, data } = req.body;

      const dadosAtualizacao: any = {};
      
      if (nome) dadosAtualizacao.nome = nome;
      if (estado) dadosAtualizacao.estado = estado.toUpperCase();
      if (cidade) dadosAtualizacao.cidade = cidade;
      if (premio) dadosAtualizacao.premio = premio;
      if (data) dadosAtualizacao.data = new Date(data);

      const ganhadorAtualizado = await GanhadorModel
        .findByIdAndUpdate(id, dadosAtualizacao, { 
          new: true,
          runValidators: true 
        })
        .lean();
      
      if (!ganhadorAtualizado) {
        return res.status(404).json({
          success: false,
          message: 'Ganhador não encontrado'
        });
      }

      res.json({
        success: true,
        data: ganhadorAtualizado,
        message: 'Ganhador atualizado com sucesso'
      });
    } catch (error: any) {
      console.error('Erro ao atualizar ganhador:', error);
      
      if (error.name === 'ValidationError') {
        const mensagens = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: mensagens
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async deletarGanhador(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const ganhadorRemovido = await GanhadorModel
        .findByIdAndDelete(id)
        .lean();
      
      if (!ganhadorRemovido) {
        return res.status(404).json({
          success: false,
          message: 'Ganhador não encontrado'
        });
      }

      res.json({
        success: true,
        data: ganhadorRemovido,
        message: 'Ganhador removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar ganhador:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async agregacaoPorEstado(req: Request, res: Response) {
    try {
      // Usar aggregation pipeline do MongoDB
      const agregacao = await GanhadorModel.aggregate([
        {
          $group: {
            _id: '$estado',
            total: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            estado: '$_id',
            total: 1
          }
        },
        {
          $sort: { total: -1 }
        }
      ]);

      res.json({
        success: true,
        data: agregacao,
        message: 'Agregação por estado recuperada com sucesso'
      });
    } catch (error) {
      console.error('Erro na agregação por estado:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}