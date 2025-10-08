<template>
  <div class="user-management-bar" v-if="users.length > 0">
    <div class="management-container">
      <div class="management-header">
        <span class="management-title">👥 Gerenciar Usuários</span>
        <button class="toggle-btn" @click="isExpanded = !isExpanded">
          {{ isExpanded ? '🔼 Minimizar' : '🔽 Expandir' }}
        </button>
      </div>
      
      <div class="management-content" :class="{ expanded: isExpanded }">
        <div class="users-grid">
          <div 
            v-for="user in users" 
            :key="user.id || user.email"
            class="user-card"
          >
            <div class="user-info">
              <div class="user-avatar">{{ user.nome.charAt(0).toUpperCase() }}</div>
              <div class="user-details">
                <h4>{{ user.nome }}</h4>
                <p>{{ user.email }}</p>
                <small>{{ user.telefone || 'Sem telefone' }}</small>
              </div>
            </div>
            
            <div class="user-actions">
              <button class="btn-edit" @click="editUser(user)" title="Editar usuário">
                ✏️
              </button>
              <button class="btn-delete" @click="deleteUser(user)" title="Excluir usuário">
                🗑️
              </button>
            </div>
          </div>
        </div>
        
        <div class="management-stats">
          <div class="stat-item">
            <span class="stat-number">{{ users.length }}</span>
            <span class="stat-label">Total de Usuários</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ recentUsers }}</span>
            <span class="stat-label">Hoje</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal de Edição -->
    <div v-if="showEditModal" class="edit-modal-overlay" @click="closeEditModal">
      <div class="edit-modal" @click.stop>
        <div class="modal-header">
          <h3>✏️ Editar Usuário</h3>
          <button class="close-btn" @click="closeEditModal">×</button>
        </div>
        
        <form @submit.prevent="saveUser" class="edit-form">
          <div class="form-group">
            <label>Nome Completo</label>
            <input v-model="editingUser.nome" type="text" required>
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input v-model="editingUser.email" type="email" required>
          </div>
          
          <div class="form-group">
            <label>Telefone</label>
            <input v-model="editingUser.telefone" type="tel">
          </div>
          
          <div class="form-group">
            <label>CPF</label>
            <input v-model="editingUser.cpf" type="text">
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="closeEditModal">
              Cancelar
            </button>
            <button type="submit" class="btn-save">
              💾 Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal de Confirmação de Exclusão -->
    <div v-if="showDeleteModal" class="delete-modal-overlay" @click="closeDeleteModal">
      <div class="delete-modal" @click.stop>
        <div class="modal-header">
          <h3>🗑️ Confirmar Exclusão</h3>
          <button class="close-btn" @click="closeDeleteModal">×</button>
        </div>
        
        <div class="modal-body">
          <p>Tem certeza que deseja excluir o usuário:</p>
          <div class="user-preview">
            <strong>{{ userToDelete?.nome }}</strong><br>
            <span>{{ userToDelete?.email }}</span>
          </div>
          <p class="warning">⚠️ Esta ação não pode ser desfeita!</p>
        </div>
        
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeDeleteModal">
            Cancelar
          </button>
          <button class="btn-confirm-delete" @click="confirmDelete">
            🗑️ Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface User {
  id?: string
  nome: string
  email: string
  telefone?: string
  cpf?: string
  senha?: string
  createdAt?: string
}

interface Emits {
  (e: 'users-updated'): void
}

const emit = defineEmits<Emits>()

const users = ref<User[]>([])
const isExpanded = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingUser = ref<User>({} as User)
const userToDelete = ref<User | null>(null)

const recentUsers = computed(() => {
  const today = new Date().toDateString()
  return users.value.filter(user => 
    user.createdAt && new Date(user.createdAt).toDateString() === today
  ).length
})

const loadUsers = () => {
  try {
    const savedUsers = localStorage.getItem('registered_users')
    if (savedUsers) {
      users.value = JSON.parse(savedUsers)
    }
  } catch (error) {
    console.warn('Erro ao carregar usuários:', error)
  }
}

const editUser = (user: User) => {
  editingUser.value = { ...user }
  showEditModal.value = true
}

const deleteUser = (user: User) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const saveUser = () => {
  try {
    const userIndex = users.value.findIndex(u => u.id === editingUser.value.id || u.email === editingUser.value.email)
    if (userIndex !== -1) {
      // Manter senha original
      const originalUser = users.value[userIndex]
      users.value[userIndex] = { ...editingUser.value, senha: originalUser?.senha || '' }
      
      localStorage.setItem('registered_users', JSON.stringify(users.value))
      
      // Atualizar usuário logado se for o mesmo
      const currentUser = localStorage.getItem('currentUser')
      if (currentUser) {
        const current = JSON.parse(currentUser)
        if (current.id === editingUser.value.id || current.email === editingUser.value.email) {
          localStorage.setItem('currentUser', JSON.stringify({
            id: editingUser.value.id,
            nome: editingUser.value.nome,
            email: editingUser.value.email,
            telefone: editingUser.value.telefone,
            cpf: editingUser.value.cpf
          }))
        }
      }
      
      emit('users-updated')
      closeEditModal()
    }
  } catch (error) {
    console.error('Erro ao salvar usuário:', error)
  }
}

const confirmDelete = () => {
  if (userToDelete.value) {
    try {
      users.value = users.value.filter(u => 
        u.id !== userToDelete.value?.id && u.email !== userToDelete.value?.email
      )
      localStorage.setItem('registered_users', JSON.stringify(users.value))
      
      // Se o usuário excluído está logado, fazer logout
      const currentUser = localStorage.getItem('currentUser')
      if (currentUser) {
        const current = JSON.parse(currentUser)
        if (current.id === userToDelete.value.id || current.email === userToDelete.value.email) {
          localStorage.removeItem('currentUser')
          window.location.reload() // Recarregar página para atualizar estado
        }
      }
      
      emit('users-updated')
      closeDeleteModal()
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
    }
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editingUser.value = {} as User
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

let userReloadInterval: number | null = null

onMounted(() => {
  loadUsers()
  // Recarregar usuários periodicamente (reduced frequency for better performance)
  userReloadInterval = setInterval(loadUsers, 15000)
})

onUnmounted(() => {
  if (userReloadInterval) {
    clearInterval(userReloadInterval)
  }
})

// Watch para mudanças no localStorage
watch(() => localStorage.getItem('registered_users'), () => {
  loadUsers()
}, { deep: true })
</script>

<style scoped>
.user-management-bar {
  background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
  color: white;
  border-bottom: 3px solid #4f46e5;
  box-shadow: 0 4px 20px rgba(30, 58, 138, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1002;
}

.management-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.management-title {
  font-weight: 700;
  font-size: 1.1rem;
  color: #fbbf24;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.management-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
}

.management-content.expanded {
  max-height: 500px;
  padding-bottom: 1rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.user-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.user-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
}

.user-details h4 {
  margin: 0;
  font-size: 1rem;
  color: white;
}

.user-details p {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: #cbd5e1;
}

.user-details small {
  color: #94a3b8;
  font-size: 0.75rem;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-edit {
  background: rgba(34, 197, 94, 0.8);
}

.btn-edit:hover {
  background: rgba(34, 197, 94, 1);
  transform: scale(1.1);
}

.btn-delete {
  background: rgba(239, 68, 68, 0.8);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 1);
  transform: scale(1.1);
}

.management-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #fbbf24;
}

.stat-label {
  font-size: 0.9rem;
  color: #cbd5e1;
}

/* Modal Styles */
.edit-modal-overlay, .delete-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.edit-modal, .delete-modal {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.close-btn:hover {
  color: #ef4444;
}

.edit-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions, .modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel {
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #4b5563;
}

.btn-save {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save:hover {
  background: #059669;
}

.btn-confirm-delete {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm-delete:hover {
  background: #dc2626;
}

.modal-body {
  padding: 1.5rem;
}

.user-preview {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
}

.warning {
  color: #ef4444;
  font-weight: 600;
  text-align: center;
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .management-container {
    padding: 0 1rem;
  }
  
  .users-grid {
    grid-template-columns: 1fr;
  }
  
  .management-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .user-card {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>