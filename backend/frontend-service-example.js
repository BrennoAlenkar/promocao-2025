// promocaoService.js - Serviço para integração com o backend
// Copie este arquivo para src/services/ no seu projeto React

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/v1';

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para logs de requisições (desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  api.interceptors.request.use(
    (config) => {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
      return config;
    },
    (error) => {
      console.error('❌ Erro na requisição:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log(`✅ ${response.status} ${response.config.url}`, response.data);
      return response;
    },
    (error) => {
      console.error('❌ Erro na resposta:', error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
}

export const promocaoService = {
  // Health check da API
  async healthCheck() {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend não está acessível');
    }
  },

  // Listar promoções com filtros
  async listarPromocoes(filtros = {}) {
    const params = new URLSearchParams();
    
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/promocoes?${params.toString()}`);
    return response.data;
  },

  // Criar nova promoção
  async criarPromocao(dadosPromocao) {
    const response = await api.post('/promocoes', dadosPromocao);
    return response.data;
  },

  // Buscar promoção específica por ID
  async buscarPromocao(id) {
    const response = await api.get(`/promocoes/${id}`);
    return response.data;
  },

  // Atualizar promoção existente
  async atualizarPromocao(id, dados) {
    const response = await api.put(`/promocoes/${id}`, dados);
    return response.data;
  },

  // Deletar promoção
  async deletarPromocao(id) {
    await api.delete(`/promocoes/${id}`);
    return { success: true, message: 'Promoção deletada com sucesso' };
  },

  // Buscar promoções de um produto específico
  async buscarPromocoesPorProduto(produtoId) {
    const response = await api.get(`/promocoes/produto/${produtoId}`);
    return response.data;
  },

  // Buscar promoções de uma categoria específica
  async buscarPromocoesPorCategoria(categoriaId) {
    const response = await api.get(`/promocoes/categoria/${categoriaId}`);
    return response.data;
  },

  // Aplicar código promocional
  async aplicarPromocao(codigoPromocional) {
    const response = await api.post('/promocoes/aplicar', { 
      codigoPromocional 
    });
    return response.data;
  },

  // Calcular desconto baseado em uma promoção
  async calcularDesconto(promocaoId, valorOriginal) {
    const response = await api.post('/promocoes/calcular-desconto', {
      promocaoId,
      valorOriginal: Number(valorOriginal)
    });
    return response.data;
  },

  // Validar se promoção está ativa e disponível
  async validarPromocao(promocaoId) {
    try {
      const promocao = await this.buscarPromocao(promocaoId);
      const agora = new Date();
      const dataInicio = new Date(promocao.data.dataInicio);
      const dataFim = new Date(promocao.data.dataFim);

      return {
        valida: promocao.data.ativo && 
                agora >= dataInicio && 
                agora <= dataFim &&
                (!promocao.data.limiteUso || promocao.data.usosAtuais < promocao.data.limiteUso),
        promocao: promocao.data,
        motivo: !promocao.data.ativo ? 'Promoção inativa' :
                agora < dataInicio ? 'Promoção ainda não iniciou' :
                agora > dataFim ? 'Promoção expirada' :
                (promocao.data.limiteUso && promocao.data.usosAtuais >= promocao.data.limiteUso) ? 'Limite de uso atingido' :
                'Promoção válida'
      };
    } catch (error) {
      return {
        valida: false,
        motivo: 'Promoção não encontrada'
      };
    }
  }
};

// Utilitários para formatação
export const promocaoUtils = {
  formatarTipoPromocao(tipo) {
    const tipos = {
      'desconto_percentual': 'Desconto Percentual',
      'desconto_fixo': 'Desconto Fixo',
      'frete_gratis': 'Frete Grátis',
      'leve_pague': 'Leve e Pague'
    };
    return tipos[tipo] || tipo;
  },

  formatarValorDesconto(tipo, valor) {
    switch (tipo) {
      case 'desconto_percentual':
        return `${valor}% OFF`;
      case 'desconto_fixo':
        return `R$ ${valor.toFixed(2)} OFF`;
      case 'frete_gratis':
        return 'FRETE GRÁTIS';
      default:
        return valor.toString();
    }
  },

  calcularDataRestante(dataFim) {
    const agora = new Date();
    const fim = new Date(dataFim);
    const diferenca = fim - agora;
    
    if (diferenca <= 0) return 'Expirada';
    
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (dias > 0) return `${dias} dia(s) restante(s)`;
    if (horas > 0) return `${horas} hora(s) restante(s)`;
    return 'Expira em breve';
  }
};

// Hook personalizado para React (opcional)
export const usePromocoes = () => {
  const [promocoes, setPromocoes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const carregarPromocoes = async (filtros = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await promocaoService.listarPromocoes(filtros);
      setPromocoes(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    promocoes,
    loading,
    error,
    carregarPromocoes,
    setPromocoes
  };
};

export default promocaoService;