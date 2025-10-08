<template>
  <header class="app-header" :class="{ scrolled: isScrolled, hidden: isHidden }">
    <nav class="navbar">
      <div class="nav-brand">
        <h1>SUPER PROMOÇÃO 2025</h1>
      </div>
      
      <ul class="nav-menu" :class="{ 'nav-menu-open': mobileMenuOpen }">
        <li class="nav-item">
          <a href="#home" class="nav-link" 
             :class="{ active: activeSection === 'home' }"
             @click="navigateToSection('home')">Home</a>
        </li>
        <li class="nav-item">
          <a href="#como-participar" class="nav-link" 
             :class="{ active: activeSection === 'como-participar' }"
             @click="navigateToSection('como-participar')">Como Participar</a>
        </li>
        <li class="nav-item dropdown" @mouseleave="closeDropdown">
          <a href="#premios" class="nav-link dropdown-toggle" 
             :class="{ active: activeSection === 'premios' }"
             @click="navigateToSection('premios')"
             @mouseenter="openDropdown">
            Prêmios <span class="dropdown-arrow">▼</span>
          </a>
          <ul class="dropdown-menu" :class="{ 'dropdown-open': dropdownOpen }">
            <li><a href="#premios-principais" @click="navigateToSection('premios')" class="dropdown-link">Prêmios Principais</a></li>
            <li><a href="#premios-mensais" @click="navigateToSection('premios')" class="dropdown-link">Prêmios Mensais</a></li>
            <li><a href="#premios-instantaneos" @click="navigateToSection('premios')" class="dropdown-link">Prêmios Instantâneos</a></li>
            <li><a href="#historico-premios" @click="navigateToSection('premios')" class="dropdown-link">Histórico</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a href="#faq" class="nav-link" 
             :class="{ active: activeSection === 'faq' }"
             @click="navigateToSection('faq')">FAQ</a>
        </li>
        <li class="nav-item">
          <a href="#ganhadores" class="nav-link" 
             :class="{ active: activeSection === 'ganhadores' }"
             @click="navigateToSection('ganhadores')">Ganhadores</a>
        </li>
        <li class="nav-item">
          <a href="#lojas" class="nav-link" 
             :class="{ active: activeSection === 'lojas' }"
             @click="navigateToSection('lojas')">Lojas</a>
        </li>
        <li class="nav-item" v-if="isAuthenticated">
          <router-link to="/admin" class="nav-link nav-link-admin">
            Usuários
          </router-link>
        </li>
        
        <li class="nav-item nav-cta" v-if="!isAuthenticated">
          <button class="btn-cadastro" @click="$emit('show-auth')">
            Entrar
          </button>
        </li>
        
        <li class="nav-item nav-cta" v-else>
          <div class="user-menu">
            <span class="user-name">Olá, {{ user?.nome?.split(' ')[0] }}!</span>
            <button class="btn-logout" @click="$emit('logout')">
              Sair
            </button>
          </div>
        </li>
      </ul>
      
      <button class="hamburger-btn" 
              :class="{ 'hamburger-open': mobileMenuOpen }"
              @click="toggleMobileMenu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  activeSection: string
  isAuthenticated: boolean
  user: any
}

interface Emits {
  (e: 'navigate', section: string): void
  (e: 'show-auth'): void
  (e: 'logout'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const isScrolled = ref(false)
const isHidden = ref(false)
const mobileMenuOpen = ref(false)
const dropdownOpen = ref(false)
const lastScrollY = ref(0)

const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  // Definir se está scrolled
  isScrolled.value = currentScrollY > 50
  
  // Lógica para ocultar/mostrar header baseado na direção do scroll
  if (currentScrollY > 100) { // Só ativa depois de 100px de scroll
    if (currentScrollY > lastScrollY.value && currentScrollY > 200) {
      // Scrolling para baixo e já passou de 200px - ocultar
      isHidden.value = true
    } else if (currentScrollY < lastScrollY.value) {
      // Scrolling para cima - mostrar
      isHidden.value = false
    }
  } else {
    // No topo da página - sempre mostrar
    isHidden.value = false
  }
  
  lastScrollY.value = currentScrollY
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const openDropdown = () => {
  dropdownOpen.value = true
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const navigateToSection = (section: string) => {
  emit('navigate', section)
  mobileMenuOpen.value = false
  dropdownOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  background: var(--gradient-primary);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border-bottom: none;
  transform: translateY(0);
}

.app-header.scrolled {
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
  box-shadow: none;
  border-bottom: none;
}

.app-header.hidden {
  transform: translateY(-100%);
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.8rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-brand h1 {
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: nowrap;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  white-space: nowrap;
  position: relative;
  display: block;
  line-height: 1.2;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #ffffff, #e8f4fd);
  transition: width 0.4s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link:hover {
  color: #e8f4fd;
}

.nav-link.active::after,
.nav-link.router-link-active::after {
  width: 100%;
  background: linear-gradient(90deg, #ffffff, #60a5fa);
  height: 3px;
}

.nav-link.active,
.nav-link.router-link-active {
  color: #ffffff;
}

.nav-link-admin {
  color: #fbbf24 !important;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.nav-link-admin::after {
  background: linear-gradient(90deg, #fbbf24, #f59e0b) !important;
}

.nav-link-admin:hover {
  color: #fde68a !important;
}

/* Dropdown Styles */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.dropdown-arrow {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(15px);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  padding: 0.5rem 0;
  margin: 0;
  list-style: none;
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1002;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.dropdown-menu.dropdown-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-link {
  display: block;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.dropdown-link:last-child {
  border-bottom: none;
}

.dropdown-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e8f4fd;
  padding-left: 1.2rem;
}

.nav-cta .btn-cadastro {
  background: var(--gradient-accent);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.nav-cta .btn-cadastro:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(249, 115, 22, 0.4);
}

.btn-users {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-users:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.btn-logout {
  background: rgba(239, 68, 68, 0.8);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.btn-logout:hover {
  background: rgba(239, 68, 68, 1);
  transform: translateY(-1px);
}

.hamburger-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger-line {
  width: 25px;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger-btn.hamburger-open .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-btn.hamburger-open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger-btn.hamburger-open .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

@media (max-width: 1200px) {
  .nav-menu {
    gap: 0.8rem;
  }
  
  .nav-link {
    padding: 0.5rem 0.6rem;
    font-size: 0.9rem;
  }
  
  .nav-brand h1 {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 2rem 1rem;
    min-height: 100px;
  }
  
  .nav-brand h1 {
    font-size: 1.2rem;
  }
  
  .hamburger-btn {
    display: flex;
  }
  
  .nav-menu {
    position: fixed;
    top: 100px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--gradient-primary);
    padding: 2rem;
    gap: 1rem;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    display: flex;
  }
  
  .nav-link {
    text-align: center;
    padding: 1rem 0.8rem;
  }
  
  .nav-menu.nav-menu-open {
    transform: translateX(0);
  }
  
  .user-menu {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .nav-brand h1 {
    font-size: 1rem;
  }
  
  .navbar {
    padding: 0.75rem;
  }
  
  .nav-menu {
    top: 70px;
    padding: 1.5rem;
  }
}


</style>