<template>
  <section id="lojas" class="lojas-section">
    <div class="container">
      <h2 class="section-title">
        Lojas Participantes
      </h2>
      <p class="section-subtitle">
        Encontre a loja mais próxima de você e participe da promoção!
      </p>
      
      <!-- Botão de Localização -->
      <div class="localizacao-container">
        <button class="btn-localizacao" @click="buscarLocalizacao" :disabled="carregandoLocalizacao">
          <span v-if="carregandoLocalizacao">🔄 Buscando...</span>
          <span v-else>📍 Encontrar Lojas Próximas</span>
        </button>
        <p v-if="localizacaoAtual" class="localizacao-atual">
          📍 Sua localização: {{ localizacaoAtual.cidade }}, {{ localizacaoAtual.estado }}
        </p>
      </div>
      
      <div class="lojas-content">
        <!-- Mapa de Lojas -->
        <div class="mapa-lojas-container">
          <h3>🗺️ Mapa das Lojas</h3>
          <div class="mapa-lojas">
            <!-- Pontos no mapa representando as lojas -->
            <div 
              v-for="loja in lojasVisiveis" 
              :key="loja.id"
              class="loja-marker"
              :style="{ 
                left: loja.x + '%', 
                top: loja.y + '%',
                '--distance': loja.distancia || 0
              }"
              :class="{ 'loja-proxima': loja.distancia && loja.distancia < 10 }"
              @click="selecionarLoja(loja)"
              @mouseenter="mostrarTooltipLoja(loja, $event)"
              @mouseleave="ocultarTooltipLoja()"
            >
              <div class="marker-icon">🏪</div>
              <div class="marker-pulse"></div>
            </div>
            
            <!-- Tooltip do mapa -->
            <div v-if="lojaHover" class="loja-tooltip" :style="tooltipStyle">
              <strong>{{ lojaHover.nome }}</strong><br>
              📍 {{ lojaHover.cidade }}, {{ lojaHover.estado }}<br>
              <span v-if="lojaHover.distancia">📏 {{ lojaHover.distancia.toFixed(1) }}km</span>
            </div>
            
            <!-- Indicador de usuário (se localizado) -->
            <div v-if="localizacaoAtual" class="usuario-marker" :style="{ left: localizacaoAtual.x + '%', top: localizacaoAtual.y + '%' }">
              <div class="user-icon">👤</div>
              <div class="user-pulse"></div>
            </div>
          </div>
          
          <div class="mapa-controles">
            <button class="controle-btn" @click="resetarMapa">🎯 Ver Todas</button>
            <button class="controle-btn" @click="mostrarApenasProximas" v-if="localizacaoAtual">📍 Apenas Próximas</button>
          </div>
        </div>
        
        <!-- Lista de Lojas -->
        <div class="lista-lojas-container">
          <div class="filtros-lojas">
            <h3>📋 Lista de Lojas</h3>
            <div class="filtros-grid">
              <select v-model="filtroEstadoLoja" class="filtro-select">
                <option value="">Todos os Estados</option>
                <option v-for="estado in estadosLojas" :key="estado" :value="estado">
                  {{ estado }}
                </option>
              </select>
              
              <input 
                type="text" 
                v-model="filtroCidadeLoja" 
                placeholder="🏙️ Buscar cidade..."
                class="filtro-input"
              >
              
              <input 
                type="text" 
                v-model="filtroNomeLoja" 
                placeholder="🔍 Nome da loja..."
                class="filtro-input"
              >
              
              <select v-model="ordenacao" class="filtro-select">
                <option value="nome">Ordenar por Nome</option>
                <option value="estado">Ordenar por Estado</option>
                <option value="distancia" v-if="localizacaoAtual">Ordenar por Distância</option>
              </select>
            </div>
          </div>
          
          <!-- Cards das Lojas -->
          <div class="lojas-grid">
            <div 
              v-for="loja in lojasFiltradas" 
              :key="loja.id"
              class="loja-card"
              :class="{ 'loja-selecionada': lojaSelecionada?.id === loja.id, 'loja-proxima': loja.distancia && loja.distancia < 10 }"
              @click="selecionarLoja(loja)"
            >
              <div class="loja-header">
                <h4>{{ loja.nome }}</h4>
                <div class="loja-badges">
                  <span class="badge-estado">{{ loja.estado }}</span>
                  <span v-if="loja.distancia && loja.distancia < 10" class="badge-proxima">Próxima</span>
                </div>
              </div>
              
              <div class="loja-info">
                <p class="loja-endereco">📍 {{ loja.endereco }}</p>
                <p class="loja-local">🏙️ {{ loja.cidade }}, {{ loja.estado }}</p>
                <p class="loja-cnpj">🏢 CNPJ: {{ formatarCNPJ(loja.cnpj) }}</p>
                <p v-if="loja.distancia" class="loja-distancia">📏 {{ loja.distancia.toFixed(1) }}km de você</p>
              </div>
              
              <div class="loja-acoes">
                <button class="btn-acao" @click.stop="verRotaLoja(loja)">🗺️ Ver Rota</button>
                <button class="btn-acao" @click.stop="telefoneLoja(loja)">📞 Contato</button>
              </div>
            </div>
          </div>
          
          <!-- Loading -->
          <div v-if="carregandoLojas" class="loading-lojas">
            <div class="spinner"></div>
            <p>Carregando lojas...</p>
          </div>
          
          <!-- Paginação das Lojas -->
          <div class="paginacao-lojas" v-if="totalPaginasLojas > 1">
            <button 
              class="pagina-btn" 
              :disabled="paginaAtualLojas === 1"
              @click="paginaAtualLojas = 1"
            >
              ««
            </button>
            <button 
              class="pagina-btn" 
              :disabled="paginaAtualLojas === 1"
              @click="paginaAtualLojas--"
            >
              ‹
            </button>
            
            <span class="pagina-info">
              {{ paginaAtualLojas }} / {{ totalPaginasLojas }}
            </span>
            
            <button 
              class="pagina-btn" 
              :disabled="paginaAtualLojas === totalPaginasLojas"
              @click="paginaAtualLojas++"
            >
              ›
            </button>
            <button 
              class="pagina-btn" 
              :disabled="paginaAtualLojas === totalPaginasLojas"
              @click="paginaAtualLojas = totalPaginasLojas"
            >
              »»
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Loja {
  id: number
  nome: string
  cnpj: string
  estado: string
  cidade: string
  endereco: string
  x: number
  y: number
  distancia?: number
  telefone?: string
}

interface Localizacao {
  cidade: string
  estado: string
  x: number
  y: number
}

const filtroEstadoLoja = ref('')
const filtroCidadeLoja = ref('')
const filtroNomeLoja = ref('')
const ordenacao = ref('nome')
const paginaAtualLojas = ref(1)
const itensPorPaginaLojas = 12

const carregandoLocalizacao = ref(false)
const carregandoLojas = ref(false)
const localizacaoAtual = ref<Localizacao | null>(null)
const lojaSelecionada = ref<Loja | null>(null)
const lojaHover = ref<Loja | null>(null)
const tooltipStyle = ref({})
const mostrarApenasPróximas = ref(false)

// Dados de exemplo das lojas
const lojas = ref<Loja[]>([
  {
    id: 1,
    nome: 'Mart & Cia',
    cnpj: '12345678000195',
    estado: 'SP',
    cidade: 'São Paulo',
    endereco: 'R. Santos Dumont, 482 - Vila Mariana',
    x: 65,
    y: 85,
    telefone: '(11) 2847-1930'
  },
  {
    id: 2,
    nome: 'SuperCompras',
    cnpj: '98765432000187',
    estado: 'RJ',
    cidade: 'Niterói',
    endereco: 'Av. Ernani do Amaral, 1205 - Centro',
    x: 78,
    y: 82,
    telefone: '(21) 3719-0562'
  },
  {
    id: 3,
    nome: 'Mercadinho do João',
    cnpj: '11122233000144',
    estado: 'MG',
    cidade: 'Uberlândia',
    endereco: 'R. Barão de Camargos, 318 - Centro',
    x: 70,
    y: 78,
    telefone: '(34) 3000-9012'
  },
  {
    id: 4,
    nome: 'Shopping Center Norte',
    cnpj: '44455566000133',
    estado: 'SP',
    cidade: 'Campinas',
    endereco: 'Av. Shopping, 1000 - Vila Nova',
    x: 63,
    y: 87,
    telefone: '(19) 3000-3456'
  },
  {
    id: 5,
    nome: 'Loja Departamentos Sul',
    cnpj: '77788899000122',
    estado: 'RS',
    cidade: 'Porto Alegre',
    endereco: 'Rua Gaúcha, 555 - Centro Histórico',
    x: 55,
    y: 95,
    telefone: '(51) 3000-7890'
  },
  {
    id: 6,
    nome: 'Mercado Família',
    cnpj: '22233344000111',
    estado: 'PR',
    cidade: 'Curitiba',
    endereco: 'Av. Paranaense, 777 - Batel',
    x: 58,
    y: 88,
    telefone: '(41) 3000-2345'
  },
  {
    id: 7,
    nome: 'Super Loja Nordeste',
    cnpj: '55566677000100',
    estado: 'PE',
    cidade: 'Recife',
    endereco: 'Rua do Sol, 333 - Boa Vista',
    x: 74,
    y: 50,
    telefone: '(81) 3000-6789'
  },
  {
    id: 8,
    nome: 'Hiper Bahia',
    cnpj: '88899900000199',
    estado: 'BA',
    cidade: 'Salvador',
    endereco: 'Av. Oceânica, 222 - Barra',
    x: 70,
    y: 60,
    telefone: '(71) 3000-0123'
  },
  {
    id: 9,
    nome: 'Mercado Central DF',
    cnpj: '33344455000188',
    estado: 'DF',
    cidade: 'Brasília',
    endereco: 'SCS Quadra 1, Bloco A - Asa Sul',
    x: 65,
    y: 70,
    telefone: '(61) 3000-4567'
  },
  {
    id: 10,
    nome: 'Loja Capixaba',
    cnpj: '66677788000177',
    estado: 'ES',
    cidade: 'Vitória',
    endereco: 'Av. Beira Mar, 888 - Centro',
    x: 80,
    y: 75,
    telefone: '(27) 3000-8901'
  }
])

// Computed properties
const estadosLojas = computed(() => 
  [...new Set(lojas.value.map(l => l.estado))].sort()
)

const lojasVisiveis = computed(() => {
  if (mostrarApenasPróximas.value && localizacaoAtual.value) {
    return lojas.value.filter(loja => loja.distancia && loja.distancia < 20)
  }
  return lojas.value
})

const lojasFiltradas = computed(() => {
  let filtered = [...lojas.value]

  // Aplicar filtros
  if (filtroEstadoLoja.value) {
    filtered = filtered.filter(l => l.estado === filtroEstadoLoja.value)
  }
  
  if (filtroCidadeLoja.value) {
    const cidade = filtroCidadeLoja.value.toLowerCase()
    filtered = filtered.filter(l => l.cidade.toLowerCase().includes(cidade))
  }
  
  if (filtroNomeLoja.value) {
    const nome = filtroNomeLoja.value.toLowerCase()
    filtered = filtered.filter(l => l.nome.toLowerCase().includes(nome))
  }

  // Aplicar ordenação
  filtered.sort((a, b) => {
    switch (ordenacao.value) {
      case 'estado':
        return a.estado.localeCompare(b.estado)
      case 'distancia':
        return (a.distancia || 999) - (b.distancia || 999)
      default:
        return a.nome.localeCompare(b.nome)
    }
  })

  // Paginação
  const inicio = (paginaAtualLojas.value - 1) * itensPorPaginaLojas
  return filtered.slice(inicio, inicio + itensPorPaginaLojas)
})

const totalPaginasLojas = computed(() => {
  let total = lojas.value.length
  
  if (filtroEstadoLoja.value || filtroCidadeLoja.value || filtroNomeLoja.value) {
    let filtered = lojas.value
    if (filtroEstadoLoja.value) filtered = filtered.filter(l => l.estado === filtroEstadoLoja.value)
    if (filtroCidadeLoja.value) filtered = filtered.filter(l => l.cidade.toLowerCase().includes(filtroCidadeLoja.value.toLowerCase()))
    if (filtroNomeLoja.value) filtered = filtered.filter(l => l.nome.toLowerCase().includes(filtroNomeLoja.value.toLowerCase()))
    total = filtered.length
  }
  
  return Math.ceil(total / itensPorPaginaLojas)
})

const buscarLocalizacao = async () => {
  carregandoLocalizacao.value = true
  
  try {
    // Simulação de geolocalização (reduced delay for better performance)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Localização de exemplo (São Paulo)
    localizacaoAtual.value = {
      cidade: 'São Paulo',
      estado: 'SP',
      x: 65,
      y: 85
    }
    
    // Calcular distâncias
    calcularDistancias()
    
  } catch (error) {
    console.error('Erro ao buscar localização:', error)
  } finally {
    carregandoLocalizacao.value = false
  }
}

const calcularDistancias = () => {
  if (!localizacaoAtual.value) return
  
  lojas.value.forEach(loja => {
    // Cálculo simplificado de distância usando coordenadas do mapa
    const dx = loja.x - localizacaoAtual.value!.x
    const dy = loja.y - localizacaoAtual.value!.y
    loja.distancia = Math.sqrt(dx * dx + dy * dy) * 10 // Fator de escala
  })
}

const selecionarLoja = (loja: Loja) => {
  lojaSelecionada.value = loja
}

const mostrarTooltipLoja = (loja: Loja, event: MouseEvent) => {
  lojaHover.value = loja
  tooltipStyle.value = {
    left: event.pageX + 10 + 'px',
    top: event.pageY - 10 + 'px'
  }
}

const ocultarTooltipLoja = () => {
  lojaHover.value = null
}

const resetarMapa = () => {
  mostrarApenasPróximas.value = false
  lojaSelecionada.value = null
}

const mostrarApenasProximas = () => {
  mostrarApenasPróximas.value = true
}

const formatarCNPJ = (cnpj: string) => {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

const verRotaLoja = (loja: Loja) => {
  // Simulação de abertura de rota no Google Maps
  const endereco = encodeURIComponent(`${loja.endereco}, ${loja.cidade}, ${loja.estado}`)
  window.open(`https://www.google.com/maps/search/${endereco}`, '_blank')
}

const telefoneLoja = (loja: Loja) => {
  if (loja.telefone) {
    window.open(`tel:${loja.telefone}`)
  }
}

onMounted(() => {
  // Simular carregamento das lojas (optimized for performance)
  carregandoLojas.value = true
  setTimeout(() => {
    carregandoLojas.value = false
  }, 300)
})
</script>

<style scoped>
.lojas-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

/* .title-icon: Removed swing animation for better performance */

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
}

.localizacao-container {
  text-align: center;
  margin-bottom: 3rem;
}

.btn-localizacao {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}

.btn-localizacao:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
}

.btn-localizacao:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.localizacao-atual {
  margin-top: 1rem;
  color: #28a745;
  font-weight: 600;
}

.lojas-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.mapa-lojas-container {
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.mapa-lojas-container h3 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.mapa-lojas {
  position: relative;
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%);
  border-radius: 1rem;
  overflow: hidden;
  border: 2px solid #e0e0e0;
}

.loja-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  transition: all 0.3s ease;
}

.loja-marker:hover {
  transform: translate(-50%, -50%) scale(1.2);
  z-index: 10;
}

.marker-icon {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
}

.loja-proxima .marker-icon {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.marker-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 107, 107, 0.3);
  opacity: 0.7;
}

.usuario-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.user-icon {
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  box-shadow: 0 3px 15px rgba(102, 126, 234, 0.4);
  border: 3px solid white;
}

.user-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.3);
  animation: ripple 3s infinite;
}

.loja-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.8rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  z-index: 1000;
  pointer-events: none;
  max-width: 200px;
}

.mapa-controles {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
}

.controle-btn {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.controle-btn:hover {
  background: #667eea;
  color: white;
}

.lista-lojas-container {
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.filtros-lojas h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.filtros-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filtro-select,
.filtro-input {
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.filtro-select:focus,
.filtro-input:focus {
  outline: none;
  border-color: #28a745;
}

.lojas-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.loja-card {
  border: 2px solid #e0e0e0;
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.loja-card:hover {
  border-color: #28a745;
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.2);
  transform: translateY(-2px);
}

.loja-selecionada {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.loja-proxima {
  border-color: #28a745;
  background: rgba(40, 167, 69, 0.05);
}

.loja-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.loja-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.loja-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge-estado {
  background: #667eea;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: bold;
}

.badge-proxima {
  background: #28a745;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: bold;
}

.loja-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
}

.loja-distancia {
  color: #28a745 !important;
  font-weight: 600 !important;
}

.loja-acoes {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-acao {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  flex: 1;
}

.btn-acao:hover {
  background: #28a745;
  color: white;
}

.loading-lojas {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #28a745;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.paginacao-lojas {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagina-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagina-btn:hover:not(:disabled) {
  background: #28a745;
  color: white;
}

.pagina-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagina-info {
  color: #666;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .lojas-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2.2rem;
    flex-direction: column;
  }
  
  .filtros-grid {
    grid-template-columns: 1fr;
  }
  
  .loja-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .mapa-lojas {
    height: 300px;
  }
  
  .mapa-controles {
    flex-direction: column;
  }
  
  .loja-acoes {
    flex-direction: column;
  }
}
</style>