<template>
  <section id="premios" class="premios-section">
    <div class="container">
      <h2 
        ref="titleRef" 
        :class="['section-title', { 'reveal-active': isTitleVisible }]"
      >
        Prêmios Incríveis
      </h2>
      <p 
        :class="['section-subtitle', { 'reveal-active': isTitleVisible }]"
      >
        Mais de R$ 1 milhão em prêmios esperando por você!
      </p>
      
      <div 
        ref="statsRef" 
        :class="['premios-stats', { 'reveal-active': isStatsVisible }]"
      >
        <div class="stat-item">
          <div class="stat-number">1000+</div>
          <div class="stat-label">Prêmios Totais</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">R$ 1Mi</div>
          <div class="stat-label">Valor Total</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">52</div>
          <div class="stat-label">Sorteios no Ano</div>
        </div>
      </div>
      
      <div class="premios-categorias">
        <div class="categoria-tabs">
          <button 
            v-for="categoria in categorias" 
            :key="categoria.id"
            :class="['tab-btn', { active: activeCategory === categoria.id }]"
            @click="activeCategory = categoria.id"
          >
            {{ categoria.icon }} {{ categoria.name }}
          </button>
        </div>
        
        <div class="premios-grid">
          <div 
            v-for="premio in filteredPremios" 
            :key="premio.id"
            class="premio-card"
            @click="selectedPremio = premio"
          >
            <div class="premio-badge">{{ premio.categoria }}</div>
            <div class="premio-image">
              <img 
                v-if="premio.imagem" 
                :src="premio.imagem" 
                :alt="premio.nome"
                class="premio-img"
                @error="handleImageError"
              />
              <span v-else class="premio-icon">{{ premio.icon }}</span>
            </div>
            <div class="premio-content">
              <h3>{{ premio.nome }}</h3>
              <p class="premio-value">{{ premio.valor }}</p>
              <p class="premio-description">{{ premio.descricao }}</p>
              <div class="premio-quantity">
                <span class="quantity-badge">{{ premio.quantidade }} disponíveis</span>
              </div>
            </div>
            <div class="premio-hover-effect">
              <span>Ver detalhes</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="sorteios-calendario">
        <h3>Calendário de Sorteios</h3>
        <div class="calendario-grid">
          <div class="sorteio-item" v-for="sorteio in proximosSorteios" :key="sorteio.id">
            <div class="sorteio-date">
              <span class="day">{{ sorteio.dia }}</span>
              <span class="month">{{ sorteio.mes }}</span>
            </div>
            <div class="sorteio-info">
              <h4>{{ sorteio.tipo }}</h4>
              <p>{{ sorteio.premios.join(', ') }}</p>
              <div class="sorteio-time">⏰ {{ sorteio.horario }}</div>
            </div>
            <div class="sorteio-status">
              <span :class="['status-badge', sorteio.status]">{{ sorteio.statusText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal de Detalhes do Prêmio -->
    <div v-if="selectedPremio" class="premio-modal" @click="selectedPremio = null">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="selectedPremio = null">×</button>
        <div class="modal-header">
          <div class="modal-image">
            <img 
              v-if="selectedPremio.imagem" 
              :src="selectedPremio.imagem" 
              :alt="selectedPremio.nome"
              class="modal-img"
              @error="handleImageError"
            />
            <span v-else class="modal-icon">{{ selectedPremio.icon }}</span>
          </div>
          <h2>{{ selectedPremio.nome }}</h2>
          <p class="modal-value">{{ selectedPremio.valor }}</p>
        </div>
        <div class="modal-body">
          <p>{{ selectedPremio.descricaoCompleta }}</p>
          <div class="modal-details">
            <div class="detail-item">
              <strong>Categoria:</strong> {{ selectedPremio.categoria }}
            </div>
            <div class="detail-item">
              <strong>Quantidade:</strong> {{ selectedPremio.quantidade }} unidades
            </div>
            <div class="detail-item">
              <strong>Valor unitário:</strong> {{ selectedPremio.valor }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'

interface Premio {
  id: number
  nome: string
  valor: string
  descricao: string
  descricaoCompleta: string
  icon: string
  categoria: string
  quantidade: number
  imagem?: string
}

interface Categoria {
  id: string
  name: string
  icon: string
}

interface Sorteio {
  id: number
  dia: string
  mes: string
  tipo: string
  premios: string[]
  horario: string
  status: 'proximo' | 'hoje' | 'concluido'
  statusText: string
}

const activeCategory = ref('todos')
const selectedPremio = ref<Premio | null>(null)

// Scroll reveal hooks
const { isVisible: isTitleVisible, elementRef: titleRef } = useScrollReveal()
const { isVisible: isStatsVisible, elementRef: statsRef } = useScrollReveal()

const categorias = ref<Categoria[]>([
  { id: 'todos', name: 'Todos', icon: '🎁' },
  { id: 'eletronicos', name: 'Eletrônicos', icon: '⚡' },
  { id: 'viagens', name: 'Viagens', icon: '✈️' },
  { id: 'carros', name: 'Veículos', icon: '🚗' },
  { id: 'dinheiro', name: 'Dinheiro', icon: '💰' },
  { id: 'casa', name: 'Casa e Decoração', icon: '🏠' }
])

const premios = ref<Premio[]>([
  {
    id: 1,
    nome: 'Smart TV 65" 4K',
    valor: 'R$ 3.200',
    descricao: 'Smart TV LED 4K com Wi-Fi',
    descricaoCompleta: 'Smart TV LED 65 polegadas 4K, sistema Smart com Wi-Fi, HDR, 3 HDMI, 2 USB.',
    icon: '📺',
    imagem: '/img/premios/smart-tv-.png',
    categoria: 'eletronicos',
    quantidade: 15
  },
  {
    id: 2,
    nome: 'iPhone 14',
    valor: 'R$ 3.500',
    descricao: 'iPhone 14 128GB',
    descricaoCompleta: 'iPhone 14, 128GB, sistema iOS, câmera dupla 12MP, tela 6.1", chip A15 Bionic.',
    icon: '📱',
    imagem: '/img/premios/apple-iphone-x-pictures-5 (1).png',
    categoria: 'eletronicos',
    quantidade: 20
  },
  {
    id: 3,
    nome: 'Vale Viagem R$ 5.000',
    valor: 'R$ 5.000',
    descricao: 'Vale para agência de viagens',
    descricaoCompleta: 'Vale viagem no valor de R$ 5.000 para usar em qualquer agência parceira, válido por 12 meses.',
    icon: '✈️',
    imagem: '/img/premios/travel-airplane-icon-png.webp',
    categoria: 'viagens',
    quantidade: 8
  },
  {
    id: 4,
    nome: 'Moto Honda CB 250F',
    valor: 'R$ 18.000',
    descricao: 'Moto Honda 0km',
    descricaoCompleta: 'Honda CB 250F Twister 0km, freios CBS, painel digital, garantia de fábrica.',
    icon: '🏍️',
    imagem: '/img/premios/versao.png',
    categoria: 'carros',
    quantidade: 3
  },
  {
    id: 5,
    nome: 'R$ 10.000 em Dinheiro',
    valor: 'R$ 10.000',
    descricao: 'Dinheiro na conta',
    descricaoCompleta: 'Prêmio em dinheiro de R$ 10.000 depositado na conta em até 15 dias úteis.',
    icon: '💰',
    imagem: '/img/premios/dinheiro.webp',
    categoria: 'dinheiro',
    quantidade: 12
  },
  {
    id: 6,
    nome: 'Smart TV 50" LED',
    valor: 'R$ 2.200',
    descricao: 'Smart TV LED 50" Full HD',
    descricaoCompleta: 'Smart TV LED 50 polegadas Full HD, sistema Smart com Wi-Fi, Netflix, YouTube, 2 HDMI, 1 USB.',
    icon: '📺',
    imagem: '/img/premios/pngtree-led-tv-television-screen-vector-png-image_6673700.png',
    categoria: 'eletronicos',
    quantidade: 25
  },
  {
    id: 7,
    nome: 'Conjunto de Móveis',
    valor: 'R$ 20.000',
    descricao: 'Sala completa com sofá, rack e mesa',
    descricaoCompleta: 'Conjunto completo para sala de estar incluindo sofá 3 lugares em couro, rack para TV, mesa de centro, poltronas e decoração.',
    icon: '🛋️',
    imagem: '/img/premios/moveis.png',
    categoria: 'casa',
    quantidade: 30
  },
  {
    id: 8,
    nome: 'Notebook Gamer',
    valor: 'R$ 4.500',
    descricao: 'Notebook Gamer 16GB RAM',
    descricaoCompleta: 'Notebook Gamer com placa de vídeo dedicada, 16GB RAM, SSD 512GB, processador Intel i7, tela 15.6" Full HD, ideal para jogos e trabalho.',
    icon: '💻',
    imagem: '/img/premios/notebook.webp',
    categoria: 'eletronicos',
    quantidade: 8
  },
  {
    id: 9,
    nome: 'Chevrolet Onix 0km',
    valor: 'R$ 85.000',
    descricao: 'Carro Chevrolet Onix 0km',
    descricaoCompleta: 'Chevrolet Onix Plus LT 1.0 Turbo 0km, câmbio automático, ar condicionado, direção elétrica, completo com garantia de fábrica.',
    icon: '🚗',
    imagem: '/img/premios/onix.png',
    categoria: 'carros',
    quantidade: 2
  }
])

const proximosSorteios = ref<Sorteio[]>([
  {
    id: 1,
    dia: '29',
    mes: 'SET',
    tipo: 'Sorteio Semanal',
    premios: ['Smart TVs', 'Smartphones', 'R$ 10.000'],
    horario: '20:00',
    status: 'proximo',
    statusText: 'Próximo'
  },
  {
    id: 2,
    dia: '06',
    mes: 'OUT',
    tipo: 'Super Sorteio',
    premios: ['Honda Civic', 'Viagem Dubai', 'R$ 50.000'],
    horario: '20:00',
    status: 'proximo',
    statusText: 'Próximo'
  },
  {
    id: 3,
    dia: '13',
    mes: 'OUT',
    tipo: 'Sorteio Especial',
    premios: ['Eletrônicos', 'Móveis', 'Dinheiro'],
    horario: '20:00',
    status: 'proximo',
    statusText: 'Próximo'
  }
])

const filteredPremios = computed(() => {
  if (activeCategory.value === 'todos') {
    return premios.value
  }
  return premios.value.filter(premio => premio.categoria === activeCategory.value)
})

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const parent = img.parentElement
  if (parent) {
    parent.innerHTML = `<span class="premio-icon">🎁</span>`
  }
}
</script>

<style scoped>
.premios-section {
  padding: 4rem 0;
  background: var(--gradient-secondary);
  color: white;
  position: relative;
  overflow: hidden;
}

.premios-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="25" cy="25" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
  animation: float 20s linear infinite;
}

@keyframes float {
  0% { transform: translateY(100vh) rotate(0deg); }
  100% { transform: translateY(-100vh) rotate(360deg); }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.section-title {
  text-align: center;
  font-size: 3.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease;
}

.section-title.reveal-active {
  opacity: 1;
  transform: translateY(0);
}

.title-icon {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.section-subtitle {
  text-align: center;
  font-size: 1.3rem;
  margin-bottom: 4rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease 0.2s;
}

.section-subtitle.reveal-active {
  opacity: 0.9;
  transform: translateY(0);
}

.premios-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-bottom: 4rem;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s ease 0.4s;
}

.premios-stats.reveal-active {
  opacity: 1;
  transform: translateY(0);
}

.stat-item {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: scale(1.05);
}

.stat-number {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, var(--warning), #fff700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

.premios-categorias {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  border-radius: 2rem;
  padding: 3rem 2rem;
  margin-bottom: 4rem;
}

.categoria-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 50px;
  background: #f8f9fa;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.tab-btn.active,
.tab-btn:hover {
  background: var(--gradient-accent);
  color: white;
  transform: translateY(-2px);
}

.premios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  justify-items: center;
  align-items: start;
}

.premio-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 380px;
}

.premio-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.premio-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--gradient-primary);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.premio-image {
  margin-bottom: 1.5rem;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
}

.premio-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05));
}

.premio-card:hover .premio-img {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.premio-icon {
  font-size: 5rem;
  animation: bounce 3s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-15px); }
  60% { transform: translateY(-8px); }
}

.premio-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.premio-value {
  font-size: 1.8rem;
  font-weight: 900;
  color: #28a745;
  margin-bottom: 1rem;
}

.premio-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.quantity-badge {
  background: #e9ecef;
  color: #495057;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
}

.premio-hover-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  font-weight: 600;
}

.premio-card:hover .premio-hover-effect {
  transform: translateY(0);
}

.sorteios-calendario {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 3rem 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.sorteios-calendario h3 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
}

.calendario-grid {
  display: grid;
  gap: 1.5rem;
}

.sorteio-item {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.sorteio-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(10px);
}

.sorteio-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 1rem;
  min-width: 80px;
}

.day {
  font-size: 2rem;
  font-weight: 900;
}

.month {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sorteio-info {
  flex: 1;
}

.sorteio-info h4 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.sorteio-info p {
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.sorteio-time {
  font-size: 0.9rem;
  opacity: 0.8;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.proximo {
  background: #28a745;
  color: white;
}

/* Modal Styles */
.premio-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 2rem;
  max-width: 600px;
  width: 100%;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  z-index: 1001;
}

.modal-header {
  text-align: center;
  padding: 3rem 2rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 2rem 2rem 0 0;
}

.modal-image {
  margin-bottom: 1.5rem;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.modal-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  display: block;
}

.modal-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.modal-value {
  font-size: 1.5rem;
  font-weight: 900;
  color: #ffd700;
}

.modal-body {
  padding: 2rem;
  color: #333;
}

.modal-details {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.detail-item {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2.5rem;
    flex-direction: column;
  }
  
  .premios-stats {
    gap: 1rem;
  }
  
  .stat-item {
    padding: 1.5rem;
  }
  
  .categoria-tabs {
    gap: 0.5rem;
  }
  
  .tab-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
  
  .premios-grid {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 1.5rem;
    padding: 0 1rem;
  }
  
  .premio-card {
    width: 100%;
    max-width: 350px;
    margin: 0 auto;
  }
  
  .sorteio-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .premio-modal {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .premios-grid {
    padding: 0 0.5rem;
    gap: 1rem;
  }
  
  .premio-card {
    max-width: 300px;
    padding: 1.5rem;
  }
  
  .premio-image {
    height: 100px;
    margin-bottom: 1rem;
  }
}
</style>