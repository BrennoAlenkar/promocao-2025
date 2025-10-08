<template>
  <section id="faq" class="faq-section">
    <div class="container">
      <h2 class="section-title">
        Perguntas Frequentes
      </h2>
      <p class="section-subtitle">
        Tire todas as suas dúvidas sobre a promoção
      </p>
      
      <div class="faq-search">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar pergunta..."
            class="search-input"
          >
          <div class="search-results-count" v-if="searchQuery">
            {{ filteredFaqs.length }} resultado(s) encontrado(s)
          </div>
        </div>
      </div>
      
      <div class="faq-categories">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['category-btn', { active: activeCategory === category.id }]"
          @click="activeCategory = category.id"
        >
          {{ category.icon }} {{ category.name }}
        </button>
      </div>
      
      <div class="faq-list">
        <div 
          v-for="faq in filteredFaqs" 
          :key="faq.id"
          class="faq-item"
          :class="{ open: openFaqs.includes(faq.id) }"
        >
          <div class="faq-question" @click="toggleFaq(faq.id)">
            <h3>{{ faq.pergunta }}</h3>
            <div class="faq-toggle">
              <span class="toggle-icon">{{ openFaqs.includes(faq.id) ? '−' : '+' }}</span>
            </div>
          </div>
          <div class="faq-answer" v-show="openFaqs.includes(faq.id)">
            <div class="answer-content">
              <p v-html="faq.resposta"></p>
              <div v-if="faq.links && faq.links.length" class="faq-links">
                <h4>Links úteis:</h4>
                <ul>
                  <li v-for="link in faq.links" :key="link.url">
                    <a :href="link.url" target="_blank">{{ link.text }}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="faq-help">
        <div class="help-card">
          <h3>Ainda tem dúvidas?</h3>
          <p>Nossa equipe está pronta para te ajudar!</p>
          <div class="help-buttons">
            <button class="btn btn-primary">
              Chat Online
            </button>
            <button class="btn btn-secondary">
              Enviar Email
            </button>
            <button class="btn btn-outline">
              Central de Atendimento
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface FaqItem {
  id: number
  pergunta: string
  resposta: string
  categoria: string
  tags: string[]
  links?: { text: string; url: string }[]
}

interface Category {
  id: string
  name: string
  icon: string
}

const searchQuery = ref('')
const activeCategory = ref('todas')
const openFaqs = ref<number[]>([])

const categories = ref<Category[]>([
  { id: 'todas', name: 'Todas', icon: '' },
  { id: 'participacao', name: 'Como Participar', icon: '' },
  { id: 'premios', name: 'Prêmios', icon: '' },
  { id: 'sorteios', name: 'Sorteios', icon: '' },
  { id: 'tecnico', name: 'Suporte Técnico', icon: '' },
  { id: 'regulamento', name: 'Regulamento', icon: '' }
])

const faqs = ref<FaqItem[]>([
  {
    id: 1,
    pergunta: 'Como faço para participar da promoção?',
    resposta: 'Para participar, você deve: <br>1. Realizar compras nas lojas participantes<br>2. Baixar o aplicativo oficial<br>3. Cadastrar sua nota fiscal<br>4. Aguardar os sorteios semanais',
    categoria: 'participacao',
    tags: ['participar', 'como', 'comprar', 'cadastrar'],
    links: [
      { text: 'Lista de lojas participantes', url: '#lojas' },
      { text: 'Download do aplicativo', url: '#app' }
    ]
  },
  {
    id: 2,
    pergunta: 'Qual o valor mínimo para participar?',
    resposta: 'O valor mínimo da compra para participar da promoção é de <strong>R$ 50,00</strong>. Valores inferiores não geram cupons para o sorteio.',
    categoria: 'participacao',
    tags: ['valor', 'mínimo', 'compra', '50 reais'],
  },
  {
    id: 3,
    pergunta: 'Quantas vezes posso participar?',
    resposta: 'Você pode participar quantas vezes quiser, desde que respeite o limite de <strong>5 cupons por CPF por semana</strong>. Cada nota fiscal válida gera um cupom.',
    categoria: 'participacao',
    tags: ['limite', 'cupons', 'semana', 'quantas vezes'],
  },
  {
    id: 4,
    pergunta: 'Quais são os prêmios da campanha?',
    resposta: 'Temos mais de 1000 prêmios no valor total de R$ 1 milhão! Incluindo:<br>• Smart TVs e eletrônicos<br>• Smartphones de última geração<br>• Viagens nacionais e internacionais<br>• Carros 0km<br>• Prêmios em dinheiro<br>• Móveis e eletrodomésticos',
    categoria: 'premios',
    tags: ['prêmios', 'valor', 'tipos', 'lista'],
    links: [
      { text: 'Ver todos os prêmios', url: '#premios' }
    ]
  },
  {
    id: 5,
    pergunta: 'Quando são realizados os sorteios?',
    resposta: 'Os sorteios são realizados <strong>todas as sextas-feiras às 20h</strong> com transmissão ao vivo em nossas redes sociais. Os resultados ficam disponíveis no aplicativo logo após o sorteio.',
    categoria: 'sorteios',
    tags: ['quando', 'horário', 'sexta-feira', '20h', 'ao vivo'],
  },
  {
    id: 6,
    pergunta: 'Como saberei se fui contemplado?',
    resposta: 'Se você for contemplado, será notificado de várias formas:<br>• Notificação no aplicativo<br>• E-mail para o endereço cadastrado<br>• SMS para o telefone informado<br>• Ligação da nossa equipe em até 24 horas',
    categoria: 'sorteios',
    tags: ['contemplado', 'ganhador', 'notificação', 'como saber'],
  },
  {
    id: 7,
    pergunta: 'Tenho prazo para retirar o prêmio?',
    resposta: 'Sim, você tem <strong>90 dias corridos</strong> a partir da data do sorteio para retirar seu prêmio. Após esse período, o prêmio retorna para um novo sorteio.',
    categoria: 'premios',
    tags: ['prazo', 'retirar', '90 dias', 'prêmio'],
  },
  {
    id: 8,
    pergunta: 'O aplicativo não está funcionando, o que fazer?',
    resposta: 'Se você está enfrentando problemas técnicos:<br>1. Verifique sua conexão com a internet<br>2. Atualize o aplicativo para a versão mais recente<br>3. Reinicie seu dispositivo<br>4. Entre em contato com nosso suporte técnico',
    categoria: 'tecnico',
    tags: ['aplicativo', 'problema', 'não funciona', 'suporte'],
    links: [
      { text: 'Suporte técnico', url: '#suporte' }
    ]
  },
  {
    id: 9,
    pergunta: 'Posso transferir meu prêmio para outra pessoa?',
    resposta: 'Não, os prêmios são <strong>intransferíveis e nominais</strong>. Apenas o ganhador cadastrado pode retirar o prêmio, mediante apresentação de documentos válidos.',
    categoria: 'regulamento',
    tags: ['transferir', 'intransferível', 'nominal', 'documentos'],
  },
  {
    id: 10,
    pergunta: 'A promoção é válida em todo o Brasil?',
    resposta: 'Sim! A promoção é válida em <strong>todo território nacional</strong>, com lojas participantes em todos os estados. Consulte a lista completa de lojas na seção específica.',
    categoria: 'regulamento',
    tags: ['brasil', 'nacional', 'estados', 'válida'],
    links: [
      { text: 'Lojas participantes por estado', url: '#lojas' }
    ]
  }
])

const filteredFaqs = computed(() => {
  let filtered = faqs.value

  // Filtrar por categoria
  if (activeCategory.value !== 'todas') {
    filtered = filtered.filter(faq => faq.categoria === activeCategory.value)
  }

  // Filtrar por busca
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(faq => 
      faq.pergunta.toLowerCase().includes(query) ||
      faq.resposta.toLowerCase().includes(query) ||
      faq.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filtered
})

const toggleFaq = (id: number) => {
  const index = openFaqs.value.indexOf(id)
  if (index > -1) {
    openFaqs.value.splice(index, 1)
  } else {
    openFaqs.value.push(id)
  }
}

// Adicionar Schema.org para FAQ
onMounted(() => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.value.map(faq => ({
      "@type": "Question",
      "name": faq.pergunta,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.resposta.replace(/<[^>]*>/g, '')
      }
    }))
  })
  document.head.appendChild(script)
})
</script>

<style scoped>
.faq-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.container {
  max-width: 1000px;
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

/* .title-icon: Removed bounce animation for better performance */

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
}

.faq-search {
  margin-bottom: 3rem;
}

.search-container {
  max-width: 500px;
  margin: 0 auto;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  border: 3px solid #dee2e6;
  border-radius: 50px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 5px 25px rgba(102, 126, 234, 0.3);
}

.search-results-count {
  text-align: center;
  margin-top: 1rem;
  color: #666;
  font-style: italic;
}

.faq-categories {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.category-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 50px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.category-btn.active,
.category-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
}

.faq-list {
  margin-bottom: 4rem;
}

.faq-item {
  background: white;
  border-radius: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.faq-item.open {
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.faq-question {
  padding: 1.5rem 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  position: relative;
}

.faq-question:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.faq-item.open .faq-question {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.faq-question h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  flex: 1;
  padding-right: 1rem;
}

.faq-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.faq-item.open .faq-toggle {
  background: rgba(255, 255, 255, 0.2);
}

.toggle-icon {
  font-size: 1.5rem;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.faq-item.open .toggle-icon {
  transform: rotate(180deg);
}

.faq-answer {
  border-top: 1px solid #eee;
  opacity: 1;
  max-height: 500px;
  transition: max-height 0.3s ease, opacity 0.3s ease;
}

.answer-content {
  padding: 2rem;
  color: #555;
  line-height: 1.8;
}

.answer-content p {
  margin-bottom: 1rem;
}

.faq-links {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.faq-links h4 {
  color: #333;
  margin-bottom: 1rem;
}

.faq-links ul {
  list-style: none;
  padding: 0;
}

.faq-links li {
  margin-bottom: 0.5rem;
}

.faq-links a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.faq-links a:hover {
  color: #764ba2;
  text-decoration: underline;
}

.faq-help {
  text-align: center;
}

.help-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 2rem;
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
}

.help-card h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.help-card p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.help-buttons {
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
  
  .faq-categories {
    gap: 0.5rem;
  }
  
  .category-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
  
  .faq-question {
    padding: 1rem 1.5rem;
  }
  
  .faq-question h3 {
    font-size: 1.1rem;
  }
  
  .answer-content {
    padding: 1.5rem;
  }
  
  .help-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>