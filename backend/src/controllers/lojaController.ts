import { Request, Response } from 'express';
import { LojaModel } from '../models/schemas';

export class LojaController {

  async listarLojas(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, estado, cidade, nome } = req.query;
      
      // Construir filtros
      const filtros: any = {};
      
      if (estado) {
        filtros.estado = new RegExp(estado as string, 'i');
      }
      
      if (cidade) {
        filtros.cidade = new RegExp(cidade as string, 'i');
      }
      
      if (nome) {
        filtros.nome = new RegExp(nome as string, 'i');
      }

      // Paginação
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Buscar lojas com filtros e paginação
      const lojas = await LojaModel
        .find(filtros)
        .sort({ nome: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean();

      // Contar total de documentos
      const total = await LojaModel.countDocuments(filtros);
      const totalPages = Math.ceil(total / limitNum);

      res.json({
        success: true,
        data: lojas,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages
        },
        message: 'Lojas recuperadas com sucesso'
      });
    } catch (error) {
      console.error('Erro ao listar lojas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async buscarLoja(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const loja = await LojaModel.findById(id).lean();
      
      if (!loja) {
        return res.status(404).json({
          success: false,
          message: 'Loja não encontrada'
        });
      }

      res.json({
        success: true,
        data: loja,
        message: 'Loja encontrada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar loja:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async criarLoja(req: Request, res: Response) {
    try {
      const { nome, cnpj, estado, cidade, endereco } = req.body;

      // Validações básicas
      if (!nome || !cnpj || !estado || !cidade || !endereco) {
        return res.status(400).json({
          success: false,
          message: 'Todos os campos são obrigatórios'
        });
      }

      // Simular geocodificação
      const coordenadas = this.simularGeocodificacao(cidade, estado);

      const novaLoja = new LojaModel({
        nome,
        cnpj,
        estado: estado.toUpperCase(),
        cidade,
        endereco,
        latitude: coordenadas.latitude,
        longitude: coordenadas.longitude
      });

      const lojaSalva = await novaLoja.save();

      res.status(201).json({
        success: true,
        data: lojaSalva,
        message: 'Loja criada com sucesso'
      });
    } catch (error: any) {
      console.error('Erro ao criar loja:', error);
      
      // Tratar erro de CNPJ duplicado
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'CNPJ já cadastrado'
        });
      }
      
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

  async atualizarLoja(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, cnpj, estado, cidade, endereco } = req.body;

      const dadosAtualizacao: any = {};
      
      if (nome) dadosAtualizacao.nome = nome;
      if (cnpj) dadosAtualizacao.cnpj = cnpj;
      if (estado) dadosAtualizacao.estado = estado.toUpperCase();
      if (cidade) dadosAtualizacao.cidade = cidade;
      if (endereco) {
        dadosAtualizacao.endereco = endereco;
        // Recalcular coordenadas se endereço mudou
        const coordenadas = this.simularGeocodificacao(cidade || '', estado || '');
        dadosAtualizacao.latitude = coordenadas.latitude;
        dadosAtualizacao.longitude = coordenadas.longitude;
      }

      const lojaAtualizada = await LojaModel
        .findByIdAndUpdate(id, dadosAtualizacao, { 
          new: true,
          runValidators: true 
        })
        .lean();
      
      if (!lojaAtualizada) {
        return res.status(404).json({
          success: false,
          message: 'Loja não encontrada'
        });
      }

      res.json({
        success: true,
        data: lojaAtualizada,
        message: 'Loja atualizada com sucesso'
      });
    } catch (error: any) {
      console.error('Erro ao atualizar loja:', error);
      
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'CNPJ já cadastrado'
        });
      }
      
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

  async deletarLoja(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const lojaRemovida = await LojaModel
        .findByIdAndDelete(id)
        .lean();
      
      if (!lojaRemovida) {
        return res.status(404).json({
          success: false,
          message: 'Loja não encontrada'
        });
      }

      res.json({
        success: true,
        data: lojaRemovida,
        message: 'Loja removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar loja:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async buscarLojaMaisProxima(req: Request, res: Response) {
    try {
      const { latitude, longitude } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: 'Latitude e longitude são obrigatórias'
        });
      }

      const userLat = parseFloat(latitude as string);
      const userLng = parseFloat(longitude as string);

      // Buscar todas as lojas e calcular distância
      const lojas = await LojaModel.find().lean();
      
      if (lojas.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Nenhuma loja encontrada'
        });
      }

      // Calcular distância para todas as lojas
      const lojasComDistancia = lojas.map(loja => {
        const distancia = this.calcularDistancia(
          userLat, userLng,
          loja.latitude || 0, loja.longitude || 0
        );
        return { ...loja, distancia };
      });

      // Encontrar a mais próxima
      const lojaMaisProxima = lojasComDistancia.reduce((prev, current) => 
        prev.distancia < current.distancia ? prev : current
      );

      res.json({
        success: true,
        data: lojaMaisProxima,
        message: 'Loja mais próxima encontrada'
      });
    } catch (error) {
      console.error('Erro ao buscar loja mais próxima:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Métodos auxiliares privados
  private simularGeocodificacao(cidade: string, estado: string): { latitude: number, longitude: number } {
    const coordenadas: { [key: string]: { latitude: number, longitude: number } } = {
      'SP-São Paulo': { latitude: -23.5505, longitude: -46.6333 },
      'RJ-Rio de Janeiro': { latitude: -22.9068, longitude: -43.1729 },
      'RJ-Niterói': { latitude: -22.8839, longitude: -43.1031 },
      'MG-Belo Horizonte': { latitude: -19.9167, longitude: -43.9345 },
      'MG-Uberlândia': { latitude: -18.9188, longitude: -48.2767 },
      'SP-Campinas': { latitude: -22.9056, longitude: -47.0608 }
    };

    const chave = `${estado}-${cidade}`;
    return coordenadas[chave] || { latitude: -15.7942, longitude: -47.8825 }; // Brasília como padrão
  }

  private calcularDistancia(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }
}