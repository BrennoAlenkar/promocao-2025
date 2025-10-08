<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import BackToTop from './components/BackToTop.vue'
import AuthModal from './components/AuthModal.vue'
import WhatsAppButton from './components/WhatsAppButton.vue'

const route = useRoute()
const router = useRouter()
const activeSection = ref('home')
const isAuthenticated = ref(false)
const currentUser = ref(null)
const showAuthModal = ref(false)

// Computed para verificar se estamos na página admin
const isAdminPage = computed(() => route.path.startsWith('/admin'))

// Função para scroll nas seções
const scrollToSection = async (section: string) => {
  activeSection.value = section
  
  // Se não estivermos na home page, navegar para lá primeiro
  if (route.path !== '/') {
    await router.push('/')
    // Aguardar um momento para a página carregar completamente
    setTimeout(() => {
      scrollToElement(section)
    }, 100)
  } else {
    scrollToElement(section)
  }
}

// Função auxiliar para fazer o scroll para o elemento
const scrollToElement = (section: string) => {
  const element = document.getElementById(section)
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

const handleAuthSuccess = () => {
  // Recarregar usuário após login
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser)
    isAuthenticated.value = true
  }
  showAuthModal.value = false
}

const handleShowAuth = () => {
  showAuthModal.value = true
}

const handleLogout = () => {
  currentUser.value = null
  isAuthenticated.value = false
  localStorage.removeItem('currentUser')
}

// Função para detectar seção ativa durante o scroll
const updateActiveSection = () => {
  if (route.path !== '/') return
  
  const sections: string[] = ['home', 'como-participar', 'premios', 'faq', 'ganhadores', 'lojas']
  const scrollPosition = window.scrollY + 100
  
  for (let i = sections.length - 1; i >= 0; i--) {
    const sectionId = sections[i]!
    const section = document.getElementById(sectionId)
    if (section && section.offsetTop <= scrollPosition) {
      activeSection.value = sectionId
      break
    }
  }
}

// Verificar autenticação ao montar
onMounted(() => {
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) {
    try {
      currentUser.value = JSON.parse(savedUser)
      isAuthenticated.value = true
    } catch (error) {
      console.warn('Erro ao carregar usuário atual:', error)
    }
  }
  
  // Adicionar listener para scroll
  window.addEventListener('scroll', updateActiveSection)
})

// Limpar listener ao desmontar
onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
})
</script>

<template>
  <div id="app">
    <!-- Header apenas na página home -->
    <AppHeader 
      v-if="!isAdminPage"
      :activeSection="activeSection"
      :isAuthenticated="isAuthenticated" 
      :user="currentUser"
      @navigate="scrollToSection" 
      @show-auth="handleShowAuth"
      @logout="handleLogout" />
    
    <!-- Conteúdo das páginas -->
    <main class="main-content" :class="{ 'admin-layout': isAdminPage }">
      <router-view @auth-success="handleAuthSuccess" />
    </main>
    
    <!-- Back to top apenas na home -->
    <BackToTop v-if="!isAdminPage" />

    <!-- WhatsApp Button -->
    <WhatsAppButton />

    <!-- Modal de Autenticação Global -->
    <AuthModal 
      :isOpen="showAuthModal" 
      @close="showAuthModal = false" 
      @success="handleAuthSuccess"
    />

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-links">
          <div class="footer-section">
            <h4>SUPER PROMOÇÃO 2025</h4>
            <p>A maior campanha promocional do ano!</p>
          </div>
          <div class="footer-section">
            <h4>Links Úteis</h4>
            <ul>
              <li><router-link to="/regulamento">Regulamento</router-link></li>
              <li><a href="#termos">Termos de Uso</a></li>
              <li><a href="#privacidade">Política de Privacidade</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Redes Sociais</h4>
            <div class="social-links">
              <a href="#" class="social-link">📘 Facebook</a>
              <a href="#" class="social-link">📸 Instagram</a>
              <a href="#" class="social-link">🐦 Twitter</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 Super Promoção. Todos os direitos reservados.</p>
          <p>Desenvolvido por <a href="https://github.com/BrennoAlenkar" target="_blank" rel="noopener noreferrer" class="developer-link">Brenno Alencar</a> &copy; 2025</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* Paleta de Cores Profissional */
:root {
  /* Cores Primárias - Azul Corporativo */
  --primary-start: #1e3a8a;
  --primary-end: #3b82f6;
  --secondary-start: #0f172a;
  --secondary-end: #334155;
  
  /* Cores de Destaque */
  --accent-blue: #2563eb;
  --accent-indigo: #4f46e5;
  --accent-teal: #0d9488;
  --accent-emerald: #059669;
  
  /* Gradientes Principais */
  --gradient-primary: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #2563eb 100%);
  --gradient-secondary: linear-gradient(135deg, #0f172a 0%, #334155 100%);
  --gradient-accent: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  --gradient-success: linear-gradient(135deg, #059669 0%, #0d9488 100%);
  
  /* Cores Neutras */
  --neutral-dark: #0f172a;
  --neutral-medium: #64748b;
  --neutral-light: #e2e8f0;
  --neutral-bg: #f8fafc;
  
  /* Estados */
  --success: #00b894;
  --warning: #fdcb6e;
  --error: #e84393;
  --info: #74b9ff;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--neutral-dark);
}

/* Tipografia Comercial Hierárquica */
h1, h2, h3, .hero-title, .section-title {
  font-family: 'Poppins', 'Inter', sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.hero-title {
  font-weight: 900;
  letter-spacing: -0.03em;
}

.btn, .nav-link, .highlight-card h3 {
  font-family: 'Poppins', 'Inter', sans-serif;
  font-weight: 600;
}

.countdown-number {
  font-family: 'Poppins', monospace;
  font-weight: 800;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.main-content {
  padding-top: 80px; /* Compensar altura do header */
}

.main-content.admin-layout {
  padding-top: 0; /* Sem header na página admin */
}

.app-footer {
  background: var(--gradient-accent);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h4 {
  color: var(--accent-teal);
  margin-bottom: 1rem;
  font-weight: 600;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: #e8e8e8;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: var(--accent-teal);
}

.social-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.social-link {
  color: #bdc3c7;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.social-link:hover {
  color: #3498db;
  background: rgba(52, 152, 219, 0.1);
}

.footer-bottom {
  border-top: 1px solid #4a5a6a;
  padding-top: 1rem;
  text-align: center;
}

.footer-bottom p {
  margin: 0.5rem 0;
  color: #95a5a6;
}

.footer-bottom p:first-child {
  font-weight: 600;
  color: white;
}

.footer-bottom p:last-child {
  font-size: 0.9rem;
  opacity: 0.8;
}

.developer-link {
  color: #74b9ff;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
}

.developer-link:hover {
  color: #0984e3;
  border-bottom-color: #0984e3;
  text-shadow: 0 0 8px rgba(116, 185, 255, 0.3);
}

/* Scroll suave para toda a página */
html {
  scroll-behavior: smooth;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: var(--gradient-primary);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gradient-accent);
}

/* Seleção de texto personalizada */
::selection {
  background: rgba(102, 126, 234, 0.3);
  color: #333;
}

::-moz-selection {
  background: rgba(102, 126, 234, 0.3);
  color: #333;
}

/* Animações globais para melhor UX */
* {
  transition: color 0.3s ease, background-color 0.3s ease;
}

/* Foco acessível */
button:focus,
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Redução de movimento para usuários sensíveis */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  html {
    scroll-behavior: auto;
  }
}

/* Responsividade global */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
  
  .main-content {
    padding-top: 70px;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-content {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding-top: 70px;
  }
}
</style>

