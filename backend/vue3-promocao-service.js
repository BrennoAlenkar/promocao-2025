// promocaoService.js - Serviço para Vue 3
// Copie este arquivo para src/services/ no seu projeto Vue 3

import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api/v1'

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Interceptors para desenvolvimento
if (import.meta.env.DEV) {
  api.interceptors.request.use(
    (config) => {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data)
      return config
    },
    (error) => {
      console.error('❌ Erro na requisição:', error)
      return Promise.reject(error)
    }
  )

  api.interceptors.response.use(
    (response) => {
      console.log(`✅ ${response.status} ${response.config.url}`, response.data)
      return response
    },
    (error) => {
      console.error('❌ Erro na resposta:', error.response?.data || error.message)
      return Promise.reject(error)
    }
  )
}

export const promocaoService = {
  // Health check da API
  async healthCheck() {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      throw new Error('Backend não está acessível')
    }
  },

  // Listar promoções com filtros
  async listarPromocoes(filtros = {}) {
    const response = await api.get('/promocoes', { params: filtros })
    return response.data
  },

  // Criar nova promoção
  async criarPromocao(dadosPromocao) {
    const response = await api.post('/promocoes', dadosPromocao)
    return response.data
  },

  // Buscar promoção por ID
  async buscarPromocao(id) {
    const response = await api.get(`/promocoes/${id}`)
    return response.data
  },

  // Atualizar promoção
  async atualizarPromocao(id, dados) {
    const response = await api.put(`/promocoes/${id}`, dados)
    return response.data
  },

  // Deletar promoção
  async deletarPromocao(id) {
    await api.delete(`/promocoes/${id}`)
    return { success: true, message: 'Promoção deletada com sucesso' }
  },

  // Buscar promoções por produto
  async buscarPromocoesPorProduto(produtoId) {
    const response = await api.get(`/promocoes/produto/${produtoId}`)
    return response.data
  },

  // Buscar promoções por categoria
  async buscarPromocoesPorCategoria(categoriaId) {
    const response = await api.get(`/promocoes/categoria/${categoriaId}`)
    return response.data
  },

  // Aplicar código promocional
  async aplicarPromocao(codigoPromocional) {
    const response = await api.post('/promocoes/aplicar', { codigoPromocional })
    return response.data
  },

  // Calcular desconto
  async calcularDesconto(promocaoId, valorOriginal) {
    const response = await api.post('/promocoes/calcular-desconto', {
      promocaoId,
      valorOriginal: Number(valorOriginal)
    })
    return response.data
  }
}

// Utilitários para Vue 3
export const promocaoUtils = {
  formatarTipoPromocao(tipo) {
    const tipos = {
      'desconto_percentual': 'Desconto Percentual',
      'desconto_fixo': 'Desconto Fixo',
      'frete_gratis': 'Frete Grátis',
      'leve_pague': 'Leve e Pague'
    }
    return tipos[tipo] || tipo
  },

  formatarValorDesconto(tipo, valor) {
    switch (tipo) {
      case 'desconto_percentual':
        return `${valor}% OFF`
      case 'desconto_fixo':
        return `R$ ${valor.toFixed(2)} OFF`
      case 'frete_gratis':
        return 'FRETE GRÁTIS'
      default:
        return valor.toString()
    }
  },

  formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  },

  formatarDataHora(data) {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  calcularTempoRestante(dataFim) {
    const agora = new Date()
    const fim = new Date(dataFim)
    const diferenca = fim - agora

    if (diferenca <= 0) return 'Expirada'

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24))
    const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (dias > 0) return `${dias} dia(s) restante(s)`
    if (horas > 0) return `${horas} hora(s) restante(s)`
    return 'Expira em breve'
  },

  promocaoAtiva(promocao) {
    const agora = new Date()
    const inicio = new Date(promocao.dataInicio)
    const fim = new Date(promocao.dataFim)

    return promocao.ativo && 
           agora >= inicio && 
           agora <= fim &&
           (!promocao.limiteUso || promocao.usosAtuais < promocao.limiteUso)
  }
}

export default promocaoService