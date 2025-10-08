<template>
  <section id="ganhadores" class="ganhadores-section">
    <div class="container">
      <h2 class="section-title">
        Nossos Ganhadores
      </h2>
      <p class="section-subtitle">
        Veja quem já foi contemplado em nossa promoção!
      </p>
      
      <!-- Estatísticas dos Ganhadores -->
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-number">{{ totalGanhadores }}</div>
          <div class="stat-label">Ganhadores</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ estadosComGanhadores }}</div>
          <div class="stat-label">Estados</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ valorTotalPremios }}</div>
          <div class="stat-label">Distribuídos</div>
        </div>
      </div>
      
      <!-- Mapa e Lista -->
      <div class="ganhadores-content">
        <!-- Mapa do Brasil -->
        <div class="mapa-container">
          <h3>Ganhadores por Estado</h3>
          <div class="mapa-brasil">
            <div class="mapa-tooltip" v-if="hoveredEstado" :style="tooltipStyle">
              <strong>{{ hoveredEstado.nome }}</strong><br>
              {{ hoveredEstado.ganhadores }} ganhador(es)
            </div>
            
            <!-- Estados do Brasil (versão simplificada) -->
            <div class="estado-region" 
                 v-for="estado in estadosBrasil" 
                 :key="estado.uf"
                 :class="['estado-' + estado.uf.toLowerCase(), { 'has-winners': estado.ganhadores > 0 }]"
                 :style="{ 
                   '--intensity': estado.ganhadores / maxGanhadoresPorEstado,
                   '--position-x': estado.x + '%',
                   '--position-y': estado.y + '%'
                 }"
                 @mouseenter="showTooltip(estado, $event)"
                 @mouseleave="hideTooltip()"
                 @click="filterByEstado(estado.uf)">
              <span class="estado-label">{{ estado.uf }}</span>
              <span class="ganhadores-count" v-if="estado.ganhadores > 0">{{ estado.ganhadores }}</span>
            </div>
          </div>
          
          <!-- Legenda do Mapa -->
          <div class="mapa-legenda">
            <h4>Legenda:</h4>
            <div class="legenda-items">
              <div class="legenda-item">
                <div class="cor-sample sem-ganhadores"></div>
                <span>Sem ganhadores</span>
              </div>
              <div class="legenda-item">
                <div class="cor-sample poucos-ganhadores"></div>
                <span>1-5 ganhadores</span>
              </div>
              <div class="legenda-item">
                <div class="cor-sample muitos-ganhadores"></div>
                <span>6+ ganhadores</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Lista de Ganhadores -->
        <div class="lista-container">
          <div class="filtros-container">
            <h3>Lista de Ganhadores</h3>
            <div class="filtros">
              <select v-model="filtroEstado" class="filtro-select">
                <option value="">Todos os Estados</option>
                <option v-for="estado in estadosDisponiveis" :key="estado" :value="estado">
                  {{ estado }}
                </option>
              </select>
              
              <select v-model="filtroPremio" class="filtro-select">
                <option value="">Todos os Prêmios</option>
                <option v-for="premio in premiosDisponiveis" :key="premio" :value="premio">
                  {{ premio }}
                </option>
              </select>
              
              <input 
                type="text" 
                v-model="filtroNome" 
                placeholder="Buscar por nome..."
                class="filtro-input"
              >
            </div>
          </div>
          
          <!-- Lista com Paginação -->
          <div class="ganhadores-lista">
            <div class="lista-header">
              <span>Mostrando {{ ganhadoresExibidos.length }} de {{ ganhadoresFiltrados.length }} ganhadores</span>
            </div>
            
            <div class="ganhador-item" v-for="ganhador in ganhadoresExibidos" :key="ganhador.id">
              <div class="ganhador-avatar">
                <span>{{ ganhador.nome.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="ganhador-info">
                <h4>{{ ganhador.nome }}</h4>
                <p class="ganhador-local">{{ ganhador.cidade }}, {{ ganhador.estado }}</p>
                <p class="ganhador-premio">{{ ganhador.premio }}</p>
                <p class="ganhador-data">{{ formatarData(ganhador.data) }}</p>
              </div>
              <div class="ganhador-badge">
                <span class="badge-estado">{{ ganhador.estado }}</span>
              </div>
            </div>
            
            <!-- Paginação -->
            <div class="paginacao" v-if="totalPaginas > 1">
              <button 
                class="pagina-btn" 
                :disabled="paginaAtual === 1"
                @click="paginaAtual = 1"
              >
                ««
              </button>
              <button 
                class="pagina-btn" 
                :disabled="paginaAtual === 1"
                @click="paginaAtual--"
              >
                ‹
              </button>
              
              <span class="pagina-info">
                Página {{ paginaAtual }} de {{ totalPaginas }}
              </span>
              
              <button 
                class="pagina-btn" 
                :disabled="paginaAtual === totalPaginas"
                @click="paginaAtual++"
              >
                ›
              </button>
              <button 
                class="pagina-btn" 
                :disabled="paginaAtual === totalPaginas"
                @click="paginaAtual = totalPaginas"
              >
                »»
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Ganhador {
  id: number
  nome: string
  estado: string
  cidade: string
  premio: string
  data: string
}

interface Estado {
  uf: string
  nome: string
  ganhadores: number
  x: number
  y: number
}

const filtroEstado = ref('')
const filtroPremio = ref('')
const filtroNome = ref('')
const paginaAtual = ref(1)
const itensPorPagina = 10

const hoveredEstado = ref<Estado | null>(null)
const tooltipStyle = ref({})

const ganhadores = ref<Ganhador[]>([
  { id: 1, nome: 'Maria S.', estado: 'SP', cidade: 'São Paulo', premio: 'Smart TV 65" 4K', data: '2024-08-15' },
  { id: 2, nome: 'João P.', estado: 'RJ', cidade: 'Rio de Janeiro', premio: 'Smartphone Galaxy', data: '2024-08-16' },
  { id: 3, nome: 'Ana C.', estado: 'MG', cidade: 'Belo Horizonte', premio: 'Vale Viagem R$ 5.000', data: '2024-08-17' },
  { id: 4, nome: 'Pedro A.', estado: 'SP', cidade: 'Campinas', premio: 'Moto Honda CB 250F', data: '2024-08-18' },
  { id: 5, nome: 'Carla O.', estado: 'RJ', cidade: 'Niterói', premio: 'R$ 10.000 em Dinheiro', data: '2024-08-19' },
  { id: 6, nome: 'Roberto M.', estado: 'RS', cidade: 'Porto Alegre', premio: 'Smart TV 65" 4K', data: '2024-08-20' },
  { id: 7, nome: 'Fernanda S.', estado: 'PR', cidade: 'Curitiba', premio: 'Vale Viagem R$ 5.000', data: '2024-08-21' },
  { id: 8, nome: 'Lucas M.', estado: 'SC', cidade: 'Florianópolis', premio: 'Smartphone Galaxy', data: '2024-08-22' },
  { id: 9, nome: 'Juliana L.', estado: 'BA', cidade: 'Salvador', premio: 'R$ 10.000 em Dinheiro', data: '2024-08-23' },
  { id: 10, nome: 'Eduardo C.', estado: 'PE', cidade: 'Recife', premio: 'Smartphone Galaxy', data: '2024-08-24' },
  { id: 11, nome: 'Patricia S.', estado: 'CE', cidade: 'Fortaleza', premio: 'Smart TV 65" 4K', data: '2024-08-25' },
  { id: 12, nome: 'Marcos A.', estado: 'GO', cidade: 'Goiânia', premio: 'Vale Viagem R$ 5.000', data: '2024-08-26' }
])

const estadosBrasil = ref<Estado[]>([
  { uf: 'AC', nome: 'Acre', ganhadores: 0, x: 15, y: 65 },
  { uf: 'AL', nome: 'Alagoas', ganhadores: 0, x: 75, y: 55 },
  { uf: 'AP', nome: 'Amapá', ganhadores: 0, x: 50, y: 15 },
  { uf: 'AM', nome: 'Amazonas', ganhadores: 0, x: 25, y: 40 },
  { uf: 'BA', nome: 'Bahia', ganhadores: 1, x: 70, y: 60 },
  { uf: 'CE', nome: 'Ceará', ganhadores: 1, x: 72, y: 40 },
  { uf: 'DF', nome: 'Distrito Federal', ganhadores: 1, x: 65, y: 70 },
  { uf: 'ES', nome: 'Espírito Santo', ganhadores: 1, x: 80, y: 75 },
  { uf: 'GO', nome: 'Goiás', ganhadores: 1, x: 60, y: 72 },
  { uf: 'MA', nome: 'Maranhão', ganhadores: 0, x: 65, y: 35 },
  { uf: 'MT', nome: 'Mato Grosso', ganhadores: 1, x: 45, y: 70 },
  { uf: 'MS', nome: 'Mato Grosso do Sul', ganhadores: 0, x: 50, y: 80 },
  { uf: 'MG', nome: 'Minas Gerais', ganhadores: 1, x: 70, y: 78 },
  { uf: 'PA', nome: 'Pará', ganhadores: 0, x: 45, y: 30 },
  { uf: 'PB', nome: 'Paraíba', ganhadores: 0, x: 77, y: 45 },
  { uf: 'PR', nome: 'Paraná', ganhadores: 1, x: 58, y: 88 },
  { uf: 'PE', nome: 'Pernambuco', ganhadores: 1, x: 74, y: 50 },
  { uf: 'PI', nome: 'Piauí', ganhadores: 0, x: 68, y: 45 },
  { uf: 'RJ', nome: 'Rio de Janeiro', ganhadores: 2, x: 78, y: 82 },
  { uf: 'RN', nome: 'Rio Grande do Norte', ganhadores: 0, x: 75, y: 38 },
  { uf: 'RS', nome: 'Rio Grande do Sul', ganhadores: 1, x: 55, y: 95 },
  { uf: 'RO', nome: 'Rondônia', ganhadores: 0, x: 30, y: 65 },
  { uf: 'RR', nome: 'Roraima', ganhadores: 0, x: 35, y: 10 },
  { uf: 'SC', nome: 'Santa Catarina', ganhadores: 1, x: 60, y: 92 },
  { uf: 'SP', nome: 'São Paulo', ganhadores: 2, x: 65, y: 85 },
  { uf: 'SE', nome: 'Sergipe', ganhadores: 0, x: 76, y: 52 },
  { uf: 'TO', nome: 'Tocantins', ganhadores: 0, x: 62, y: 55 }
])

// Computed properties
const totalGanhadores = computed(() => ganhadores.value.length)
const estadosComGanhadores = computed(() => 
  new Set(ganhadores.value.map(g => g.estado)).size
)
const valorTotalPremios = computed(() => 'R$ 2,5Mi')

const maxGanhadoresPorEstado = computed(() => 
  Math.max(...estadosBrasil.value.map(e => e.ganhadores))
)

const estadosDisponiveis = computed(() => 
  [...new Set(ganhadores.value.map(g => g.estado))].sort()
)

const premiosDisponiveis = computed(() => 
  [...new Set(ganhadores.value.map(g => g.premio))].sort()
)

const ganhadoresFiltrados = computed(() => {
  let filtered = ganhadores.value

  // filtra por estado se selecionado
  if (filtroEstado.value) {
    filtered = filtered.filter(g => g.estado === filtroEstado.value)
  }
  
  // filtra por prêmio se selecionado
  if (filtroPremio.value) {
    filtered = filtered.filter(g => g.premio === filtroPremio.value)
  }
  
  // filtra por nome se digitado
  if (filtroNome.value) {
    const nome = filtroNome.value.toLowerCase()
    filtered = filtered.filter(g => g.nome.toLowerCase().includes(nome))
  }

  return filtered
})

const totalPaginas = computed(() => 
  Math.ceil(ganhadoresFiltrados.value.length / itensPorPagina)
)

const ganhadoresExibidos = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina
  const fim = inicio + itensPorPagina
  return ganhadoresFiltrados.value.slice(inicio, fim)
})

const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const showTooltip = (estado: Estado, event: MouseEvent) => {
  hoveredEstado.value = estado
  tooltipStyle.value = {
    left: event.pageX + 10 + 'px',
    top: event.pageY - 10 + 'px'
  }
}

const hideTooltip = () => {
  hoveredEstado.value = null
}

const filterByEstado = (uf: string) => {
  filtroEstado.value = uf
  paginaAtual.value = 1
}

// Atualizar contadores dos estados
onMounted(() => {
  ganhadores.value.forEach(ganhador => {
    const estado = estadosBrasil.value.find(e => e.uf === ganhador.estado)
    if (estado) {
      estado.ganhadores++
    }
  })
})
</script>

<style scoped>
.ganhadores-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f1f3f4 0%, #e8eaf6 100%);
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

/* .title-icon: Removed continuous rotation animation for better performance */

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
}

.stats-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 4rem;
  flex-wrap: wrap;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  min-width: 150px;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-weight: 600;
}

.ganhadores-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.mapa-container {
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.mapa-container h3 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.mapa-brasil {
  position: relative;
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 1rem;
  overflow: hidden;
}

.estado-region {
  position: absolute;
  width: 40px;
  height: 30px;
  border-radius: 0.3rem;
  background: #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  left: var(--position-x);
  top: var(--position-y);
  transform: translate(-50%, -50%);
}

.estado-region.has-winners {
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, calc(0.3 + var(--intensity) * 0.7)) 0%, 
    rgba(118, 75, 162, calc(0.3 + var(--intensity) * 0.7)) 100%);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
}

.estado-region:hover {
  transform: translate(-50%, -50%) scale(1.2);
  z-index: 10;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.ganhadores-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: bold;
}

.mapa-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  z-index: 1000;
  pointer-events: none;
}

.mapa-legenda {
  margin-top: 1.5rem;
}

.mapa-legenda h4 {
  margin-bottom: 1rem;
  color: #333;
}

.legenda-items {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.legenda-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.cor-sample {
  width: 20px;
  height: 15px;
  border-radius: 0.2rem;
}

.sem-ganhadores { background: #e0e0e0; }
.poucos-ganhadores { background: rgba(102, 126, 234, 0.5); }
.muitos-ganhadores { background: rgba(102, 126, 234, 1); }

.lista-container {
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.filtros-container h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.filtros {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filtro-input {
  grid-column: 1 / -1;
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
  border-color: #667eea;
}

.lista-header {
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.ganhador-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.8rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.ganhador-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.ganhador-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.ganhador-info {
  flex: 1;
}

.ganhador-info h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.ganhador-info p {
  margin: 0.2rem 0;
  font-size: 0.9rem;
  color: #666;
}

.badge-estado {
  background: #667eea;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: bold;
}

.paginacao {
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
  background: #667eea;
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
  .ganhadores-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2.2rem;
    flex-direction: column;
  }
  
  .stats-container {
    gap: 1rem;
  }
  
  .filtros {
    grid-template-columns: 1fr;
  }
  
  .ganhador-item {
    flex-direction: column;
    text-align: center;
  }
  
  .mapa-brasil {
    height: 300px;
  }
  
  .estado-region {
    width: 30px;
    height: 25px;
    font-size: 0.6rem;
  }
}
</style>