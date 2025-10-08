import { body, param, query, ValidationChain } from 'express-validator';
import { TipoPromocao } from '../models/types';

// Validações para Promoção
export const validateCreatePromocao: ValidationChain[] = [
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 3, max: 100 })
    .withMessage('Nome deve ter entre 3 e 100 caracteres'),
  
  body('descricao')
    .notEmpty()
    .withMessage('Descrição é obrigatória')
    .isLength({ min: 10, max: 500 })
    .withMessage('Descrição deve ter entre 10 e 500 caracteres'),
  
  body('tipo')
    .isIn(Object.values(TipoPromocao))
    .withMessage('Tipo de promoção inválido'),
  
  body('valor')
    .isFloat({ min: 0 })
    .withMessage('Valor deve ser um número positivo'),
  
  body('produtos')
    .isArray({ min: 1 })
    .withMessage('Deve conter pelo menos um produto'),
  
  body('dataInicio')
    .isISO8601()
    .withMessage('Data de início deve ser uma data válida')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Data de início não pode ser no passado');
      }
      return true;
    }),
  
  body('dataFim')
    .isISO8601()
    .withMessage('Data de fim deve ser uma data válida')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.dataInicio)) {
        throw new Error('Data de fim deve ser posterior à data de início');
      }
      return true;
    }),
  
  body('limiteUso')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Limite de uso deve ser um número inteiro positivo'),
  
  body('codigoPromocional')
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage('Código promocional deve ter entre 3 e 20 caracteres')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Código promocional deve conter apenas letras maiúsculas e números')
];

export const validateUpdatePromocao: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('ID inválido'),
  
  body('nome')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Nome deve ter entre 3 e 100 caracteres'),
  
  body('descricao')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Descrição deve ter entre 10 e 500 caracteres'),
  
  body('tipo')
    .optional()
    .isIn(Object.values(TipoPromocao))
    .withMessage('Tipo de promoção inválido'),
  
  body('valor')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Valor deve ser um número positivo'),
  
  body('produtos')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Deve conter pelo menos um produto'),
  
  body('dataInicio')
    .optional()
    .isISO8601()
    .withMessage('Data de início deve ser uma data válida'),
  
  body('dataFim')
    .optional()
    .isISO8601()
    .withMessage('Data de fim deve ser uma data válida'),
  
  body('limiteUso')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Limite de uso deve ser um número inteiro positivo'),
  
  body('ativo')
    .optional()
    .isBoolean()
    .withMessage('Ativo deve ser verdadeiro ou falso')
];

// Validações para Produto
export const validateCreateProduto: ValidationChain[] = [
  body('nome')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('preco')
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo'),
  
  body('categoria')
    .notEmpty()
    .withMessage('Categoria é obrigatória'),
  
  body('descricao')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Descrição não pode ter mais de 500 caracteres')
];

// Validação de ID
export const validateId: ValidationChain[] = [
  param('id')
    .isMongoId()
    .withMessage('ID inválido')
];

// Validações de query para listagem
export const validateListQuery: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número inteiro positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser um número entre 1 e 100'),
  
  query('sortBy')
    .optional()
    .isString()
    .withMessage('Campo de ordenação deve ser uma string'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Ordem deve ser "asc" ou "desc"')
];