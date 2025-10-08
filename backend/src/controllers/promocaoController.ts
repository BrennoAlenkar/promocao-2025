import { Request, Response } from 'express';
import { PromocaoService } from '../services/promocaoService';
import { CreatePromocaoDTO, UpdatePromocaoDTO, FiltrosPromocao, PaginacaoParams } from '../models/dtos';
import { asyncHandler } from '../middlewares/errorHandler';

export class PromocaoController {
  private promocaoService: PromocaoService;

  constructor() {
    this.promocaoService = new PromocaoService();
  }

  criarPromocao = asyncHandler(async (req: Request, res: Response) => {
    const dadosPromocao: CreatePromocaoDTO = req.body;
    const promocao = await this.promocaoService.criarPromocao(dadosPromocao);

    res.status(201).json({
      success: true,
      message: 'Promoção criada com sucesso',
      data: promocao
    });
  });

  listarPromocoes = asyncHandler(async (req: Request, res: Response) => {
    const filtros: FiltrosPromocao = {};
    
    // pega os filtros da query string
    if (req.query.ativo === 'true') filtros.ativo = true;
    if (req.query.ativo === 'false') filtros.ativo = false;
    if (req.query.tipo) filtros.tipo = req.query.tipo as any;
    if (req.query.categoria) filtros.categoria = req.query.categoria as string;
    if (req.query.codigoPromocional) filtros.codigoPromocional = req.query.codigoPromocional as string;
    if (req.query.dataInicio) filtros.dataInicio = new Date(req.query.dataInicio as string);
    if (req.query.dataFim) filtros.dataFim = new Date(req.query.dataFim as string);

    // config da paginação
    const paginacao: PaginacaoParams = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      sortBy: req.query.sortBy as string || 'createdAt',
      sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'desc'
    };

    const resultado = await this.promocaoService.listarPromocoes(filtros, paginacao);

    res.json({
      success: true,
      message: 'Promoções listadas com sucesso',
      data: resultado.promocoes,
      pagination: {
        page: resultado.page,
        limit: paginacao.limit,
        total: resultado.total,
        totalPages: resultado.totalPages
      }
    });
  });

  buscarPromocao = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new Error('ID é obrigatório'); // precisa do id pra buscar
    const promocao = await this.promocaoService.buscarPromocaoPorId(id);

    res.json({
      success: true,
      message: 'Promoção encontrada',
      data: promocao
    });
  });

  atualizarPromocao = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new Error('ID é obrigatório'); // precisa do id
    const dadosAtualizacao: UpdatePromocaoDTO = req.body;
    
    const promocao = await this.promocaoService.atualizarPromocao(id, dadosAtualizacao);

    res.json({
      success: true,
      message: 'Promoção atualizada com sucesso',
      data: promocao
    });
  });

  deletarPromocao = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new Error('ID é obrigatório'); // tem que ter o id pra deletar
    await this.promocaoService.deletarPromocao(id);

    res.json({
      success: true,
      message: 'Promoção deletada com sucesso'
    });
  });

  buscarPromocoesPorProduto = asyncHandler(async (req: Request, res: Response) => {
    const { produtoId } = req.params;
    if (!produtoId) throw new Error('ID do produto é obrigatório'); // precisa do id do produto
    const promocoes = await this.promocaoService.buscarPromocoesPorProduto(produtoId);

    res.json({
      success: true,
      message: 'Promoções do produto encontradas',
      data: promocoes
    });
  });

  buscarPromocoesPorCategoria = asyncHandler(async (req: Request, res: Response) => {
    const { categoriaId } = req.params;
    if (!categoriaId) throw new Error('ID da categoria é obrigatório'); // precisa do id da categoria
    const promocoes = await this.promocaoService.buscarPromocoesPorCategoria(categoriaId);

    res.json({
      success: true,
      message: 'Promoções da categoria encontradas',
      data: promocoes
    });
  });

  aplicarPromocao = asyncHandler(async (req: Request, res: Response) => {
    const { codigoPromocional } = req.body;
    const promocao = await this.promocaoService.aplicarPromocao(codigoPromocional);

    res.json({
      success: true,
      message: 'Promoção aplicada com sucesso',
      data: promocao
    });
  });

  calcularDesconto = asyncHandler(async (req: Request, res: Response) => {
    const { promocaoId, valorOriginal } = req.body;
    
    // busca a promoção primeiro, depois calcula o desconto
    const promocao = await this.promocaoService.buscarPromocaoPorId(promocaoId);
    const resultado = await this.promocaoService.calcularDesconto(promocao, valorOriginal);

    res.json({
      success: true,
      message: 'Desconto calculado com sucesso',
      data: {
        promocao: {
          id: promocao._id,
          nome: promocao.nome,
          tipo: promocao.tipo
        },
        valorOriginal,
        ...resultado
      }
    });
  });
}