import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Super Promoção 2025 API',
      version: '1.0.0',
      description: 'API REST para o sistema de promoções - Landing Page Promocional',
      contact: {
        name: 'Equipe de Desenvolvimento',
        email: 'api@superpromo2025.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor de desenvolvimento'
      },
      {
        url: 'https://api.superpromo2025.com/api/v1',
        description: 'Servidor de produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Ganhador: {
          type: 'object',
          required: ['nome', 'estado', 'cidade', 'premio', 'data'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único do ganhador',
              example: '507f1f77bcf86cd799439011'
            },
            nome: {
              type: 'string',
              description: 'Nome completo do ganhador',
              example: 'Maria Silva Santos'
            },
            estado: {
              type: 'string',
              description: 'Estado (UF) do ganhador',
              example: 'SP',
              enum: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
            },
            cidade: {
              type: 'string',
              description: 'Cidade do ganhador',
              example: 'São Paulo'
            },
            premio: {
              type: 'string',
              description: 'Descrição do prêmio ganho',
              example: 'Smart TV 50 polegadas'
            },
            data: {
              type: 'string',
              format: 'date',
              description: 'Data do sorteio/ganho (ISO 8601)',
              example: '2024-08-15'
            }
          }
        },
        Loja: {
          type: 'object',
          required: ['nome', 'cnpj', 'estado', 'cidade', 'endereco'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único da loja',
              example: '507f1f77bcf86cd799439012'
            },
            nome: {
              type: 'string',
              description: 'Nome da loja',
              example: 'Supermercado Bom Preço'
            },
            cnpj: {
              type: 'string',
              description: 'CNPJ da loja',
              example: '12.345.678/0001-90'
            },
            estado: {
              type: 'string',
              description: 'Estado (UF) da loja',
              example: 'SP'
            },
            cidade: {
              type: 'string',
              description: 'Cidade da loja',
              example: 'São Paulo'
            },
            endereco: {
              type: 'string',
              description: 'Endereço completo da loja',
              example: 'Rua das Flores, 123 - Centro'
            },
            latitude: {
              type: 'number',
              description: 'Latitude geográfica',
              example: -23.5505
            },
            longitude: {
              type: 'number',
              description: 'Longitude geográfica',
              example: -46.6333
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica se a requisição foi bem-sucedida'
            },
            data: {
              type: 'object',
              description: 'Dados da resposta'
            },
            message: {
              type: 'string',
              description: 'Mensagem informativa'
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'number',
                  description: 'Página atual'
                },
                limit: {
                  type: 'number',
                  description: 'Itens por página'
                },
                total: {
                  type: 'number',
                  description: 'Total de itens'
                },
                totalPages: {
                  type: 'number',
                  description: 'Total de páginas'
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };