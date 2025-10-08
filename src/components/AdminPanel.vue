<template>
  <div class="admin-panel" v-if="isOpen">
    <div class="admin-overlay" @click="close"></div>
    <div class="admin-content">
      <div class="admin-header">
        <h2>🔧 Painel Administrativo</h2>
        <button class="btn-close" @click="close">✕</button>
      </div>
      
      <div class="admin-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'usuarios' }"
          @click="activeTab = 'usuarios'"
        >
          👤 Usuários ({{ usuarios.length }})
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'stats' }"
          @click="activeTab = 'stats'"
        >
          📊 Estatísticas
        </button>
      </div>

      <div class="admin-body">
        <!-- Tab de Usuários -->
        <div v-if="activeTab === 'usuarios'" class="usuarios-tab">
          <div class="search-bar">
            <input 
              type="text" 
              v-model="searchTerm" 
              placeholder="🔍 Buscar usuário por nome ou email..."
              class="search-input"
            >
          </div>
          
          <div class="usuarios-list">
            <div v-if="filteredUsuarios.length === 0" class="empty-state">
              <p>Nenhum usuário encontrado</p>
            </div>
            
            <div 
              v-for="usuario in filteredUsuarios" 
              :key="usuario.id" 
              class="usuario-card"
            >
              <div class="usuario-info">
                <div class="usuario-avatar">
                  {{ usuario.nome.charAt(0).toUpperCase() }}
                </div>
                <div class="usuario-details">
                  <h4>{{ usuario.nome }}</h4>
                  <p class="email">{{ usuario.email }}</p>
                  <p class="meta">
                    📱 {{ usuario.telefone || 'Não informado' }} | 
                    🆔 {{ usuario.cpf || 'Não informado' }}
                  </p>
                </div>
              </div>
              <div class="usuario-actions">
                <span class="status active">✅ Ativo</span>
                <small class="date">
                  Cadastrado em {{ formatDate(usuario.createdAt) }}
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab de Estatísticas -->
        <div v-if="activeTab === 'stats'" class="stats-tab">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <h3>{{ usuarios.length }}</h3>
                <p>Usuários Cadastrados</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📈</div>
              <div class="stat-info">
                <h3>{{ usuariosHoje }}</h3>
                <p>Cadastros Hoje</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-info">
                <h3>{{ usuariosSemana }}</h3>
                <p>Cadastros Esta Semana</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🏆</div>
              <div class="stat-info">
                <h3>100%</h3>
                <p>Taxa de Ativação</p>
              </div>
            </div>
          </div>

          <div class="recent-registrations">
            <h3>📅 Últimos Cadastros</h3>
            <div class="recent-list">
              <div 
                v-for="usuario in ultimosUsuarios" 
                :key="usuario.id"
                class="recent-item"
              >
                <div class="recent-avatar">
                  {{ usuario.nome.charAt(0).toUpperCase() }}
                </div>
                <div class="recent-info">
                  <strong>{{ usuario.nome }}</strong>
                  <small>{{ formatDate(usuario.createdAt) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const activeTab = ref('usuarios')
const searchTerm = ref('')
const usuarios = ref<any[]>([])
const loading = ref(false)

const filteredUsuarios = computed(() => {
  if (!searchTerm.value) return usuarios.value
  
  const term = searchTerm.value.toLowerCase()
  return usuarios.value.filter(usuario => 
    usuario.nome.toLowerCase().includes(term) ||
    usuario.email.toLowerCase().includes(term)
  )
})

const usuariosHoje = computed(() => {
  const hoje = new Date().toDateString()
  return usuarios.value.filter(usuario => 
    new Date(usuario.createdAt).toDateString() === hoje
  ).length
})

const usuariosSemana = computed(() => {
  const agora = new Date()
  const semanaAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000)
  return usuarios.value.filter(usuario => 
    new Date(usuario.createdAt) >= semanaAtras
  ).length
})

const ultimosUsuarios = computed(() => {
  return [...usuarios.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadUsuarios = async () => {
  loading.value = true
  try {
    // Simular carregamento de usuários do backend
    // Em produção, isso viria de uma API GET /usuarios
    const mockUsuarios = [
      {
        id: '1',
        nome: 'Usuário Demo',
        email: 'demo@exemplo.com',
        telefone: '11999999999',
        cpf: '123.456.789-01',
        createdAt: new Date().toISOString(),
        ativo: true
      }
    ]

    // Adicionar usuários do localStorage se existirem
    const savedUsers = localStorage.getItem('registered_users')
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers)
        if (Array.isArray(parsedUsers)) {
          mockUsuarios.push(...parsedUsers)
        }
      } catch (e) {
        console.warn('Erro ao carregar usuários salvos:', e)
      }
    }

    usuarios.value = mockUsuarios
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  } finally {
    loading.value = false
  }
}

const close = () => {
  emit('close')
}

onMounted(() => {
  loadUsuarios()
})
</script>

<style scoped>
.admin-panel {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}

.admin-content {
  position: relative;
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 1000px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: var(--gradient-primary);
  color: white;
}

.admin-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.btn-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.admin-tabs {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.tab-btn {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  background: rgba(59, 130, 246, 0.1);
}

.tab-btn.active {
  color: var(--accent-blue);
  border-bottom-color: var(--accent-blue);
  background: white;
}

.admin-body {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.usuarios-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.usuario-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 15px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.usuario-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.usuario-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.usuario-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.usuario-details h4 {
  margin: 0 0 0.25rem 0;
  color: #333;
}

.email {
  color: var(--accent-blue);
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.meta {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.usuario-actions {
  text-align: right;
}

.status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.date {
  display: block;
  color: #666;
  font-size: 0.8rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 15px;
  border: 1px solid #e9ecef;
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.8rem;
  color: #333;
}

.stat-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.recent-registrations h3 {
  color: #333;
  margin-bottom: 1rem;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
}

.recent-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.recent-info strong {
  display: block;
  color: #333;
}

.recent-info small {
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

@media (max-width: 768px) {
  .admin-content {
    width: 95%;
    max-height: 90vh;
  }
  
  .admin-header {
    padding: 1rem;
  }
  
  .admin-body {
    padding: 1rem;
  }
  
  .usuario-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>