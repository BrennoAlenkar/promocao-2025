import { PromocaoModel, IPromocaoDocument } from '../models/schemas';
import { CreatePromocaoDTO, UpdatePromocaoDTO, FiltrosPromocao, PaginacaoParams } from '../models/dtos';
import { AppError } from '../middlewares/errorHandler';
import { TipoPromocao } from '../models/types';

export class PromocaoService {
  async criarPromocao(dadosPromocao: CreatePromocaoDTO): Promise<IPromocaoDocument> {
    // verifica se já tem outro código igual
    if (dadosPromocao.codigoPromocional) {
      const promocaoExistente = await PromocaoModel.findOne({
        codigoPromocional: dadosPromocao.codigoPromocional
      });
      
      if (promocaoExistente) {
        throw new AppError('Código promocional já existe', 409);
      }
    }

    // data de fim tem que ser depois da de início
    if (new Date(dadosPromocao.dataFim) <= new Date(dadosPromocao.dataInicio)) {
      throw new AppError('Data de fim deve ser posterior à data de início', 400);
    }

    const promocao = new PromocaoModel({
      ...dadosPromocao,
      usosAtuais: 0,
      ativo: true
    });

    return await promocao.save();
  }

  async listarPromocoes(filtros: FiltrosPromocao = {}, paginacao: PaginacaoParams = {}): Promise<{
    promocoes: IPromocaoDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginacao;
    const skip = (page - 1) * limit;

    // monta os filtros pra busca
    const query: any = {};
    
    if (filtros.ativo !== undefined) {
      query.ativo = filtros.ativo;
    }
    
    if (filtros.tipo) {
      query.tipo = filtros.tipo;
    }
    
    if (filtros.categoria) {
      query.categorias = { $in: [filtros.categoria] };
    }
    
    if (filtros.codigoPromocional) {
      query.codigoPromocional = new RegExp(filtros.codigoPromocional, 'i');
    }

    // Filtros de data
    if (filtros.dataInicio || filtros.dataFim) {
      query.$and = [];
      
      if (filtros.dataInicio) {
        query.$and.push({ dataInicio: { $gte: filtros.dataInicio } });
      }
      
      if (filtros.dataFim) {
        query.$and.push({ dataFim: { $lte: filtros.dataFim } });
      }
    }

    const [promocoes, total] = await Promise.all([
      PromocaoModel.find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit),
      PromocaoModel.countDocuments(query)
    ]);

    return {
      promocoes,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async buscarPromocaoPorId(id: string): Promise<IPromocaoDocument> {
    const promocao = await PromocaoModel.findById(id);
    
    if (!promocao) {
      throw new AppError('Promoção não encontrada', 404);
    }
    
    return promocao;
  }

  async atualizarPromocao(id: string, dadosAtualizacao: UpdatePromocaoDTO): Promise<IPromocaoDocument> {
    const promocao = await this.buscarPromocaoPorId(id);

    // Verificar código promocional único se estiver sendo atualizado
    if (dadosAtualizacao.codigoPromocional && dadosAtualizacao.codigoPromocional !== promocao.codigoPromocional) {
      const promocaoExistente = await PromocaoModel.findOne({
        codigoPromocional: dadosAtualizacao.codigoPromocional,
        _id: { $ne: id }
      });
      
      if (promocaoExistente) {
        throw new AppError('Código promocional já existe', 409);
      }
    }

    // Validar datas se ambas estiverem sendo atualizadas
    const dataInicio = dadosAtualizacao.dataInicio || promocao.dataInicio;
    const dataFim = dadosAtualizacao.dataFim || promocao.dataFim;
    
    if (new Date(dataFim) <= new Date(dataInicio)) {
      throw new AppError('Data de fim deve ser posterior à data de início', 400);
    }

    const promocaoAtualizada = await PromocaoModel.findByIdAndUpdate(
      id,
      dadosAtualizacao,
      { new: true, runValidators: true }
    );

    return promocaoAtualizada!;
  }

  async deletarPromocao(id: string): Promise<void> {
    const promocao = await this.buscarPromocaoPorId(id);
    await PromocaoModel.findByIdAndDelete(id);
  }

  async buscarPromocoesPorProduto(produtoId: string): Promise<IPromocaoDocument[]> {
    const agora = new Date();
    
    return await PromocaoModel.find({
      produtos: { $in: [produtoId] },
      ativo: true,
      dataInicio: { $lte: agora },
      dataFim: { $gte: agora }
    });
  }

  async buscarPromocoesPorCategoria(categoriaId: string): Promise<IPromocaoDocument[]> {
    const agora = new Date();
    
    return await PromocaoModel.find({
      categorias: { $in: [categoriaId] },
      ativo: true,
      dataInicio: { $lte: agora },
      dataFim: { $gte: agora }
    });
  }

  async aplicarPromocao(codigoPromocional: string): Promise<IPromocaoDocument> {
    const promocao = await PromocaoModel.findOne({
      codigoPromocional,
      ativo: true
    });

    if (!promocao) {
      throw new AppError('Código promocional não encontrado ou inativo', 404);
    }

    const agora = new Date();
    
    // Verificar se a promoção está no período válido
    if (agora < promocao.dataInicio || agora > promocao.dataFim) {
      throw new AppError('Promoção não está no período válido', 400);
    }

    // Verificar limite de uso
    if (promocao.limiteUso && promocao.usosAtuais >= promocao.limiteUso) {
      throw new AppError('Limite de uso da promoção atingido', 400);
    }

    // Incrementar uso da promoção
    promocao.usosAtuais += 1;
    await promocao.save();

    return promocao;
  }

  async calcularDesconto(promocao: IPromocaoDocument, valorOriginal: number): Promise<{
    valorDesconto: number;
    valorFinal: number;
    tipoDesconto: string;
  }> {
    let valorDesconto = 0;
    let valorFinal = valorOriginal;

    switch (promocao.tipo) {
      case TipoPromocao.DESCONTO_PERCENTUAL:
        valorDesconto = (valorOriginal * promocao.valor) / 100;
        valorFinal = valorOriginal - valorDesconto;
        break;

      case TipoPromocao.DESCONTO_FIXO:
        valorDesconto = Math.min(promocao.valor, valorOriginal);
        valorFinal = valorOriginal - valorDesconto;
        break;

      case TipoPromocao.FRETE_GRATIS:
        // Lógica específica para frete grátis pode ser implementada aqui
        valorDesconto = 0; // Valor do frete seria calculado separadamente
        valorFinal = valorOriginal;
        break;

      default:
        throw new AppError('Tipo de promoção não suportado', 400);
    }

    return {
      valorDesconto,
      valorFinal: Math.max(0, valorFinal), // Garantir que não seja negativo
      tipoDesconto: promocao.tipo
    };
  }
}