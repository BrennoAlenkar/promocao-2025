export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  categoria: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Promocao {
  id: string;
  nome: string;
  descricao: string;
  tipo: TipoPromocao;
  valor: number; // Valor do desconto (em % ou valor fixo)
  produtos: string[]; // IDs dos produtos
  categorias?: string[]; // IDs das categorias (opcional)
  dataInicio: Date;
  dataFim: Date;
  codigoPromocional?: string;
  limiteUso?: number; // Limite de usos da promoção
  usosAtuais: number;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum TipoPromocao {
  DESCONTO_PERCENTUAL = 'desconto_percentual',
  DESCONTO_FIXO = 'desconto_fixo',
  FRETE_GRATIS = 'frete_gratis',
  LEVE_PAGUE = 'leve_pague'
}

export interface Categoria {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AplicacaoPromocao {
  promocaoId: string;
  produtoId: string;
  valorOriginal: number;
  valorDesconto: number;
  valorFinal: number;
  dataAplicacao: Date;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  telefone: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  user?: Omit<Usuario, 'senha'>;
  token?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  cpf: string;
  senha: string;
  telefone?: string;
}

export interface Ganhador {
  id: string;
  nome: string;
  estado: string; // UF
  cidade: string;
  premio: string;
  data: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Loja {
  id: string;
  nome: string;
  cnpj: string;
  estado: string; // UF
  cidade: string;
  endereco: string;
  latitude?: number;
  longitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgregacaoEstado {
  estado: string;
  total: number;
}