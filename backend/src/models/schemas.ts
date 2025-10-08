import mongoose, { Schema, Document } from 'mongoose';
import { TipoPromocao } from './types';

// Interfaces para os documentos do MongoDB (omitindo id dos types originais)
export interface IProdutoDocument extends Document {
  nome: string;
  descricao?: string;
  preco: number;
  categoria: string;
  ativo: boolean;
}

export interface IPromocaoDocument extends Document {
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
  usosAtuais: number;
  ativo: boolean;
}

export interface ICategoriaDocument extends Document {
  nome: string;
  descricao?: string;
  ativo: boolean;
}

// Schema para Categoria
const CategoriaSchema = new Schema<ICategoriaDocument>({
  nome: { type: String, required: true, unique: true },
  descricao: { type: String },
  ativo: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Schema para Produto
const ProdutoSchema = new Schema<IProdutoDocument>({
  nome: { type: String, required: true },
  descricao: { type: String },
  preco: { type: Number, required: true, min: 0 },
  categoria: { type: String, required: true },
  ativo: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Schema para Promoção
const PromocaoSchema = new Schema<IPromocaoDocument>({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  tipo: { 
    type: String, 
    required: true, 
    enum: Object.values(TipoPromocao)
  },
  valor: { type: Number, required: true, min: 0 },
  produtos: [{ type: String, required: true }],
  categorias: [{ type: String }],
  dataInicio: { type: Date, required: true },
  dataFim: { type: Date, required: true },
  codigoPromocional: { type: String, unique: true, sparse: true },
  limiteUso: { type: Number, min: 1 },
  usosAtuais: { type: Number, default: 0, min: 0 },
  ativo: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Índices para melhor performance
PromocaoSchema.index({ dataInicio: 1, dataFim: 1 });
PromocaoSchema.index({ ativo: 1 });
PromocaoSchema.index({ produtos: 1 });

ProdutoSchema.index({ categoria: 1 });
ProdutoSchema.index({ ativo: 1 });

CategoriaSchema.index({ ativo: 1 });

// Validação customizada para datas da promoção
PromocaoSchema.pre('save', function(next) {
  if (this.dataFim <= this.dataInicio) {
    next(new Error('Data de fim deve ser posterior à data de início'));
  }
  next();
});

// Interface para Ganhador
export interface IGanhadorDocument extends Document {
  nome: string;
  estado: string;
  cidade: string;
  premio: string;
  data: Date;
}

// Schema para Ganhador
const GanhadorSchema: Schema = new Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  estado: {
    type: String,
    required: [true, 'Estado é obrigatório'],
    uppercase: true,
    length: [2, 'Estado deve ter 2 caracteres (UF)']
  },
  cidade: {
    type: String,
    required: [true, 'Cidade é obrigatória'],
    trim: true,
    maxlength: [100, 'Cidade deve ter no máximo 100 caracteres']
  },
  premio: {
    type: String,
    required: [true, 'Prêmio é obrigatório'],
    trim: true,
    maxlength: [200, 'Prêmio deve ter no máximo 200 caracteres']
  },
  data: {
    type: Date,
    required: [true, 'Data é obrigatória'],
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Interface para Loja
export interface ILojaDocument extends Document {
  nome: string;
  cnpj: string;
  estado: string;
  cidade: string;
  endereco: string;
  latitude?: number;
  longitude?: number;
}

// Schema para Loja
const LojaSchema: Schema = new Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  cnpj: {
    type: String,
    required: [true, 'CNPJ é obrigatório'],
    unique: true
  },
  estado: {
    type: String,
    required: [true, 'Estado é obrigatório'],
    uppercase: true,
    length: [2, 'Estado deve ter 2 caracteres (UF)']
  },
  cidade: {
    type: String,
    required: [true, 'Cidade é obrigatória'],
    trim: true,
    maxlength: [100, 'Cidade deve ter no máximo 100 caracteres']
  },
  endereco: {
    type: String,
    required: [true, 'Endereço é obrigatório'],
    trim: true,
    maxlength: [300, 'Endereço deve ter no máximo 300 caracteres']
  },
  latitude: {
    type: Number,
    min: [-90, 'Latitude deve estar entre -90 e 90'],
    max: [90, 'Latitude deve estar entre -90 e 90']
  },
  longitude: {
    type: Number,
    min: [-180, 'Longitude deve estar entre -180 e 180'],
    max: [180, 'Longitude deve estar entre -180 e 180']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Índices para otimização
GanhadorSchema.index({ estado: 1 });
GanhadorSchema.index({ data: -1 });
LojaSchema.index({ estado: 1 });
LojaSchema.index({ cnpj: 1 });
LojaSchema.index({ latitude: 1, longitude: 1 });

// Models
export const CategoriaModel = mongoose.model<ICategoriaDocument>('Categoria', CategoriaSchema);
export const ProdutoModel = mongoose.model<IProdutoDocument>('Produto', ProdutoSchema);
export const PromocaoModel = mongoose.model<IPromocaoDocument>('Promocao', PromocaoSchema);
export const GanhadorModel = mongoose.model<IGanhadorDocument>('Ganhador', GanhadorSchema);
export const LojaModel = mongoose.model<ILojaDocument>('Loja', LojaSchema);