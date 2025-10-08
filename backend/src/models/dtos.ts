import { TipoPromocao } from './types';

export interface CreatePromocaoDTO {
  nome: string;
  descricao: string;
  tipo: TipoPromocao;
  valor: number;
  produtos: string[];
  categorias?: string[];
  dataInicio: Date;
  dataFim: Date;
  codigoPromocional?: string;
  limiteUso?: number;
}

export interface UpdatePromocaoDTO {
  nome?: string;
  descricao?: string;
  tipo?: TipoPromocao;
  valor?: number;
  produtos?: string[];
  categorias?: string[];
  dataInicio?: Date;
  dataFim?: Date;
  codigoPromocional?: string;
  limiteUso?: number;
  ativo?: boolean;
}

export interface CreateProdutoDTO {
  nome: string;
  descricao?: string;
  preco: number;
  categoria: string;
}

export interface UpdateProdutoDTO {
  nome?: string;
  descricao?: string;
  preco?: number;
  categoria?: string;
  ativo?: boolean;
}

export interface CreateCategoriaDTO {
  nome: string;
  descricao?: string;
}

export interface UpdateCategoriaDTO {
  nome?: string;
  descricao?: string;
  ativo?: boolean;
}

export interface FiltrosPromocao {
  ativo?: boolean;
  tipo?: TipoPromocao;
  categoria?: string;
  dataInicio?: Date;
  dataFim?: Date;
  codigoPromocional?: string;
}

export interface PaginacaoParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}