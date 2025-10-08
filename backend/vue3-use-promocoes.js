// usePromocoes.js - Composable para Vue 3
// Copie este arquivo para src/composables/ no seu projeto Vue 3

import { ref, reactive, computed } from 'vue'
import { promocaoService, promocaoUtils } from '@/services/promocaoService'

export function usePromocoes() {
  // Estado reativo
  const state = reactive({
    promocoes: [],
    promocaoAtual: null,
    loading: false,
    error: null,
    filtros: {
      ativo: true,
      page: 1,
      limit: 10,
      tipo: '',
      categoria: '',
      codigoPromocional: ''
    },
    paginacao: {
      total: 0,
      totalPages: 0,
      page: 1
    }
  })

  // Computed properties
  const promocoesAtivas = computed(() => 
    state.promocoes.filter(p => promocaoUtils.promocaoAtiva(p))
  )

  const promocoesExpiradas = computed(() =>
    state.promocoes.filter(p => !promocaoUtils.promocaoAtiva(p))
  )

  const temPromocoes = computed(() => state.promocoes.length > 0)

  // Métodos principais
  const carregarPromocoes = async (filtros = {}) => {
    try {
      state.loading = true
      state.error = null

      const filtrosCompletos = { ...state.filtros, ...filtros }
      const response = await promocaoService.listarPromocoes(filtrosCompletos)

      state.promocoes = response.data
      
      if (response.pagination) {
        state.paginacao = {
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
          page: response.pagination.page
        }
      }

      return response
    } catch (err) {
      state.error = err.message || 'Erro ao carregar promoções'
      console.error('Erro ao carregar promoções:', err)
      throw err
    } finally {
      state.loading = false
    }
  }

  const buscarPromocao = async (id) => {
    try {
      state.loading = true
      state.error = null

      const response = await promocaoService.buscarPromocao(id)
      state.promocaoAtual = response.data

      return response
    } catch (err) {
      state.error = err.message || 'Erro ao buscar promoção'
      throw err
    } finally {
      state.loading = false
    }
  }

  const criarPromocao = async (dadosPromocao) => {
    try {
      state.loading = true
      state.error = null

      const response = await promocaoService.criarPromocao(dadosPromocao)
      
      // Adicionar à lista local
      state.promocoes.unshift(response.data)
      
      return response
    } catch (err) {
      state.error = err.message || 'Erro ao criar promoção'
      throw err
    } finally {
      state.loading = false
    }
  }

  const atualizarPromocao = async (id, dados) => {
    try {
      state.loading = true
      state.error = null

      const response = await promocaoService.atualizarPromocao(id, dados)
      
      // Atualizar na lista local
      const index = state.promocoes.findIndex(p => p._id === id)
      if (index !== -1) {
        state.promocoes[index] = response.data
      }

      // Atualizar promoção atual se for a mesma
      if (state.promocaoAtual?._id === id) {
        state.promocaoAtual = response.data
      }

      return response
    } catch (err) {
      state.error = err.message || 'Erro ao atualizar promoção'
      throw err
    } finally {
      state.loading = false
    }
  }

  const deletarPromocao = async (id) => {
    try {
      state.loading = true
      state.error = null

      await promocaoService.deletarPromocao(id)
      
      // Remover da lista local
      state.promocoes = state.promocoes.filter(p => p._id !== id)
      
      // Limpar promoção atual se for a mesma
      if (state.promocaoAtual?._id === id) {
        state.promocaoAtual = null
      }

    } catch (err) {
      state.error = err.message || 'Erro ao deletar promoção'
      throw err
    } finally {
      state.loading = false
    }
  }

  const aplicarCodigo = async (codigoPromocional) => {
    try {
      state.loading = true
      state.error = null

      const response = await promocaoService.aplicarPromocao(codigoPromocional)
      
      // Atualizar contador de usos na lista local
      const promocao = state.promocoes.find(p => p.codigoPromocional === codigoPromocional)
      if (promocao) {
        promocao.usosAtuais += 1
      }

      return response
    } catch (err) {
      state.error = err.message || 'Erro ao aplicar código promocional'
      throw err
    } finally {
      state.loading = false
    }
  }

  const calcularDesconto = async (promocaoId, valorOriginal) => {
    try {
      const response = await promocaoService.calcularDesconto(promocaoId, valorOriginal)
      return response
    } catch (err) {
      state.error = err.message || 'Erro ao calcular desconto'
      throw err
    }
  }

  // Métodos de filtro e paginação
  const definirFiltros = (novosFiltros) => {
    Object.assign(state.filtros, novosFiltros)
  }

  const limparFiltros = () => {
    Object.assign(state.filtros, {
      ativo: true,
      page: 1,
      limit: 10,
      tipo: '',
      categoria: '',
      codigoPromocional: ''
    })
  }

  const irParaPagina = async (pagina) => {
    state.filtros.page = pagina
    await carregarPromocoes()
  }

  const proximaPagina = async () => {
    if (state.paginacao.page < state.paginacao.totalPages) {
      await irParaPagina(state.paginacao.page + 1)
    }
  }

  const paginaAnterior = async () => {
    if (state.paginacao.page > 1) {
      await irParaPagina(state.paginacao.page - 1)
    }
  }

  // Métodos utilitários
  const limparErro = () => {
    state.error = null
  }

  const limparPromocaoAtual = () => {
    state.promocaoAtual = null
  }

  // Health check
  const verificarConexao = async () => {
    try {
      await promocaoService.healthCheck()
      return true
    } catch (err) {
      state.error = 'Não foi possível conectar com o backend'
      return false
    }
  }

  return {
    // Estado
    state,
    
    // Computed
    promocoesAtivas,
    promocoesExpiradas,
    temPromocoes,
    
    // Estados individuais (para compatibilidade)
    promocoes: state.promocoes,
    promocaoAtual: state.promocaoAtual,
    loading: state.loading,
    error: state.error,
    filtros: state.filtros,
    paginacao: state.paginacao,
    
    // Métodos principais
    carregarPromocoes,
    buscarPromocao,
    criarPromocao,
    atualizarPromocao,
    deletarPromocao,
    aplicarCodigo,
    calcularDesconto,
    
    // Métodos de filtro/paginação
    definirFiltros,
    limparFiltros,
    irParaPagina,
    proximaPagina,
    paginaAnterior,
    
    // Métodos utilitários
    limparErro,
    limparPromocaoAtual,
    verificarConexao
  }
}

// Composable para uma única promoção
export function usePromocao(id = null) {
  const promocao = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const carregarPromocao = async (promocaoId = id) => {
    if (!promocaoId) {
      error.value = 'ID da promoção é obrigatório'
      return
    }

    try {
      loading.value = true
      error.value = null
      
      const response = await promocaoService.buscarPromocao(promocaoId)
      promocao.value = response.data
      
      return response
    } catch (err) {
      error.value = err.message || 'Erro ao carregar promoção'
      throw err
    } finally {
      loading.value = false
    }
  }

  const atualizarPromocao = async (dados) => {
    if (!promocao.value?._id) {
      error.value = 'Promoção não carregada'
      return
    }

    try {
      loading.value = true
      error.value = null
      
      const response = await promocaoService.atualizarPromocao(promocao.value._id, dados)
      promocao.value = response.data
      
      return response
    } catch (err) {
      error.value = err.message || 'Erro ao atualizar promoção'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Carregar automaticamente se ID foi fornecido
  if (id) {
    carregarPromocao(id)
  }

  return {
    promocao,
    loading,
    error,
    carregarPromocao,
    atualizarPromocao
  }
}

export default usePromocoes