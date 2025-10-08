<template>
  <div class="admin-page">
    <!-- Header da página administrativa -->
    <div class="admin-header">
      <div class="header-container">
        <div class="header-left">
          <div class="admin-brand">
            <div class="brand-icon">🛠️</div>
            <div class="brand-content">
              <h1 class="admin-title">Painel Administrativo</h1>
              <p class="admin-subtitle">Gestão de usuários e configurações da promoção</p>
            </div>
          </div>
        </div>
        
        <div class="header-right">
          <div class="header-actions">
            <router-link to="/" class="btn-back">
              <span class="btn-icon">←</span>
              <span class="btn-text">Voltar para o site</span>
            </router-link>
            
            <div class="user-section" v-if="currentUser">
              <div class="user-avatar">
                {{ currentUser.nome.charAt(0).toUpperCase() }}
              </div>
              <div class="user-details">
                <span class="user-greeting">Olá,</span>
                <span class="user-name">{{ currentUser.nome.split(' ')[0] }}!</span>
              </div>
              <button @click="handleLogout" class="btn-logout">
                <span class="logout-icon">🚪</span>
                <span class="logout-text">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo administrativo -->
    <div class="admin-content">
      <UsuariosSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UsuariosSection from '../components/UsuariosSection.vue'

const router = useRouter()
const currentUser = ref<any>(null)

const handleLogout = () => {
  localStorage.removeItem('currentUser')
  currentUser.value = null
  router.push('/')
}

onMounted(() => {
  // Verificar se há usuário logado
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) {
    try {
      currentUser.value = JSON.parse(savedUser)
    } catch (error) {
      console.warn('Erro ao carregar usuário atual:', error)
    }
  }
})
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #2563eb 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-icon {
  font-size: 2.5rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.75rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.brand-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.admin-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  color: white;
  letter-spacing: -0.025em;
}

.admin-subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  font-weight: 400;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-icon {
  font-size: 1.1rem;
}

.btn-text {
  white-space: nowrap;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.user-greeting {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
}

.user-name {
  font-weight: 600;
  color: white;
  font-size: 0.95rem;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(239, 68, 68, 0.15);
  color: white;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-logout:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.logout-icon {
  font-size: 1rem;
}

.logout-text {
  white-space: nowrap;
}

.admin-content {
  padding: 0;
  flex: 1;
}

@media (max-width: 1024px) {
  .header-container {
    padding: 0 1.5rem;
    gap: 1.5rem;
  }
  
  .admin-brand {
    gap: 0.75rem;
  }
  
  .brand-icon {
    font-size: 2rem;
    padding: 0.6rem;
  }
  
  .admin-title {
    font-size: 1.5rem;
  }
  
  .admin-subtitle {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .admin-header {
    padding: 1rem 0;
  }
  
  .header-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
    padding: 0 1rem;
  }
  
  .header-left,
  .header-right {
    width: 100%;
  }
  
  .admin-brand {
    justify-content: center;
    text-align: center;
  }
  
  .brand-content {
    align-items: center;
  }
  
  .header-actions {
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .user-section {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
    padding: 1rem;
  }
  
  .user-details {
    align-items: center;
  }
  
  .btn-back,
  .btn-logout {
    min-width: 140px;
    justify-content: center;
  }
}
</style>