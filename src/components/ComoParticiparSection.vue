<template>
  <section id="como-participar" class="como-participar-section">
    <div class="container">
      <h2 
        ref="titleRef" 
        :class="['section-title', { 'reveal-active': isTitleVisible }]"
      >
        Como Participar
      </h2>
      <p 
        ref="subtitleRef" 
        :class="['section-subtitle', { 'reveal-active': isSubtitleVisible }]"
      >
        Siga estes passos simples e concorra a prêmios incríveis!
      </p>
      
      <div class="steps-container">
        <div ref="stepsRef" class="steps-grid">
          <div 
            class="step-card" 
            v-for="(step, index) in steps" 
            :key="step.id"
            :class="{ 'reveal-active': isStepsVisible }"
            :style="{ 'animation-delay': `${index * 0.1}s` }"
          >
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-icon">{{ step.icon }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
            <div class="step-details">
              <ul>
                <li v-for="detail in step.details" :key="detail">{{ detail }}</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="participation-flow">
          <div class="flow-arrow">⬇️</div>
          <div class="flow-item">
            <div class="step-number">1</div>
            <h3>🛒 Faça suas compras</h3>
            <p>Nas lojas participantes espalhadas por todo o Brasil</p>
          </div>
          <div class="flow-arrow">⬇️</div>
          <div class="flow-item">
            <div class="step-number">2</div>
            <h3>📱 Cadastre no app</h3>
            <p>Fotografe sua nota fiscal e cadastre no nosso aplicativo</p>
          </div>
          <div class="flow-arrow">⬇️</div>
          <div class="flow-item">
            <div class="step-number">3</div>
            <h3>🎲 Aguarde o sorteio</h3>
            <p>Sorteios realizados toda semana com transmissão ao vivo</p>
          </div>
          <div class="flow-arrow">⬇️</div>
          <div class="flow-item">
            <div class="step-number">4</div>
            <h3>🏆 Ganhe prêmios</h3>
            <p>Se for sorteado, entraremos em contato em até 24h</p>
          </div>
        </div>
      </div>
      
      <div class="rules-highlight">
        <h3>Regras Importantes</h3>
        <div class="rules-grid">
          <div class="rule-item">
            <div>
              <h4>Período da Promoção</h4>
              <p>De 01/01/2025 a 31/12/2025</p>
            </div>
          </div>
          <div class="rule-item">
            <div>
              <h4>Valor Mínimo</h4>
              <p>Compras a partir de R$ 50,00</p>
            </div>
          </div>
          <div class="rule-item">
            <div>
              <h4>Limite de Participação</h4>
              <p>Até 5 cupons por CPF por semana</p>
            </div>
          </div>
          <div class="rule-item">
            <div>
              <h4>Sorteios</h4>
              <p>Todas as sextas-feiras às 20h</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="cta-section">
        <h3>Pronto para participar?</h3>
        <div class="cta-buttons">
          <button class="btn btn-primary" @click="mostrarDownloadApp">
            Baixar App Oficial
          </button>
          <button class="btn btn-secondary" @click="scrollToLojas">
            Encontrar Lojas
          </button>
          <router-link to="/regulamento" class="btn btn-outline">
            Ler Regulamento Completo
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'

interface Step {
  id: number
  icon: string
  title: string
  description: string
  details: string[]
}

// Scroll reveal hooks
const { isVisible: isTitleVisible, elementRef: titleRef } = useScrollReveal()
const { isVisible: isSubtitleVisible, elementRef: subtitleRef } = useScrollReveal()
const { isVisible: isStepsVisible, elementRef: stepsRef } = useScrollReveal()

const steps = ref<Step[]>([
  {
    id: 1,
    icon: '🛒',
    title: 'Realize suas compras',
    description: 'Compre em qualquer loja participante da promoção',
    details: [
      'Valor mínimo de R$ 50,00',
      'Guarde sua nota fiscal',
      'Verifique se a loja participa'
    ]
  },
  {
    id: 2,
    icon: '📱',
    title: 'Baixe o aplicativo',
    description: 'Faça o download do app oficial da promoção',
    details: [
      'Disponível na App Store e Google Play',
      'Cadastro rápido e gratuito',
      'Interface simples e intuitiva'
    ]
  },
  {
    id: 3,
    icon: '📸',
    title: 'Cadastre sua nota',
    description: 'Fotografe e cadastre sua nota fiscal no app',
    details: [
      'Foto clara e legível',
      'Todos os dados devem estar visíveis',
      'Cadastro em até 30 dias da compra'
    ]
  },
  {
    id: 4,
    icon: '🎲',
    title: 'Aguarde o sorteio',
    description: 'Participe dos sorteios semanais automáticos',
    details: [
      'Sorteios toda sexta-feira',
      'Transmissão ao vivo',
      'Resultados publicados no app'
    ]
  }
])

const mostrarDownloadApp = () => {
  const mensagem = `App em Desenvolvimento!\n\n` +
                  `O aplicativo oficial da Super Promoção 2025 está sendo desenvolvido e estará disponível em breve.\n\n` +
                  `Enquanto isso, você pode:\n` +
                  `• Verificar as lojas participantes\n` +
                  `• Ler o regulamento completo\n` +
                  `• Acompanhar os ganhadores\n\n` +
                  `Em breve nas lojas: App Store e Google Play`
  
  alert(mensagem)
}

const scrollToLojas = () => {
  const element = document.getElementById('lojas')
  if (element) {
    const headerOffset = 90
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}
</script>

<style scoped>
.como-participar-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
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
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease;
}

.section-title.reveal-active {
  opacity: 1;
  transform: translateY(0);
}

.title-icon {
  font-size: 3.5rem;
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 4rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease 0.2s;
}

.section-subtitle.reveal-active {
  opacity: 1;
  transform: translateY(0);
}

.steps-container {
  margin-bottom: 4rem;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.step-card {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 1.5rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  border: 3px solid transparent;
  opacity: 0;
  transform: translateY(50px) scale(0.9);
}

.step-card.reveal-active {
  opacity: 1;
  opacity: 1;
  transform: translateY(0) scale(1);
}

.step-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  border-color: var(--accent-mint);
}

.step-card:hover .step-icon {
  transform: scale(1.1);
}

.step-number {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gradient-primary);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.step-icon {
  font-size: 4rem;
  margin: 1rem 0;
  transition: transform 0.3s ease;
}

.step-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.step-card p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.step-details ul {
  list-style: none;
  padding: 0;
  text-align: left;
}

.step-details li {
  padding: 0.5rem 0;
  color: #555;
  position: relative;
  padding-left: 1.5rem;
}

.step-details li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #28a745;
  font-weight: bold;
}

.participation-flow {
  background: white;
  padding: 3rem 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.flow-item {
  margin: 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 1rem;
  transition: all 0.3s ease;
  position: relative;
}

.flow-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.step-number {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #ff6b6b, #ff6b9d);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  box-shadow: 0 2px 10px rgba(255, 107, 107, 0.3);
}

.flow-item h3 {
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.flow-arrow {
  font-size: 2rem;
  margin: 1rem 0;
  animation: whatsappBounce 2s ease-in-out infinite;
  display: inline-block;
}

@keyframes whatsappBounce {
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-8px);
  }
  50% {
    transform: translateY(-4px);
  }
  75% {
    transform: translateY(-8px);
  }
}

.rules-highlight {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  padding: 3rem 2rem;
  border-radius: 1.5rem;
  margin: 4rem 0;
  border-left: 5px solid #ffc107;
}

.rules-highlight h3 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #856404;
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.7);
  padding: 1.5rem;
  border-radius: 1rem;
}

.rule-icon {
  font-size: 2rem;
  min-width: 60px;
  text-align: center;
}

.rule-item h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.rule-item p {
  margin: 0;
  color: #666;
  font-weight: 600;
}

.cta-section {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1.5rem;
  color: white;
}

.cta-section h3 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.btn-secondary {
  background: linear-gradient(135deg, #ffc107 0%, #ffed4e 100%);
  color: #333;
}

.btn-outline {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2.2rem;
    flex-direction: column;
  }
  
  .steps-grid {
    grid-template-columns: 1fr;
  }
  
  .rules-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>