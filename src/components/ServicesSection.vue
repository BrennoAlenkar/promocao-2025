<template>
  <section class="services-section">
    <div class="container">
      <h2>Nossos Serviços</h2>
      <p class="section-subtitle">
        Oferecemos uma gama completa de serviços para atender suas necessidades
      </p>
      
      <div class="services-grid">
        <div class="service-card" v-for="service in services" :key="service.id">
          <div class="service-icon">{{ service.icon }}</div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
          <ul class="service-features">
            <li v-for="feature in service.features" :key="feature">{{ feature }}</li>
          </ul>
          <button class="btn-service">Saiba mais</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Service {
  id: number
  title: string
  description: string
  icon: string
  features: string[]
}

const services = ref<Service[]>([
  {
    id: 1,
    title: 'Desenvolvimento Web',
    description: 'Criamos sites e aplicações web modernas e responsivas',
    icon: '💻',
    features: ['Sites responsivos', 'Aplicações SPA', 'E-commerce', 'APIs REST']
  },
  {
    id: 2,
    title: 'Consultoria Técnica',
    description: 'Orientação especializada para seus projetos tecnológicos',
    icon: '🎯',
    features: ['Análise de requisitos', 'Arquitetura de software', 'Code review', 'Otimização']
  },
  {
    id: 3,
    title: 'Suporte e Manutenção',
    description: 'Mantenha seus sistemas sempre funcionando perfeitamente',
    icon: '🔧',
    features: ['Monitoramento 24/7', 'Atualizações', 'Backup automático', 'Suporte técnico']
  }
])
</script>

<style scoped>
.services-section {
  padding: 4rem 0;
  background: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.services-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.service-card {
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-align: center;
  border: 1px solid #f0f0f0;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.service-icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.service-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.service-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.service-features {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  text-align: left;
}

.service-features li {
  padding: 0.5rem 0;
  color: #555;
  position: relative;
  padding-left: 1.5rem;
}

.service-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.btn-service {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-service:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .services-section h2 {
    font-size: 2rem;
  }
}
</style>