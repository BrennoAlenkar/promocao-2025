<template>
  <section id="usuarios" class="usuarios-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">👥 Usuários</h2>
        <p class="section-description">
          Painel administrativo
        </p>
      </div>

      <div class="usuarios-stats">
        <div class="stat-card">
          <div class="stat-number">{{ users.length }}</div>
          <div class="stat-label">Total de Usuários</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ users.filter(u => u.telefone).length }}</div>
          <div class="stat-label">Com Telefone</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ users.filter(u => u.cpf).length }}</div>
          <div class="stat-label">Com CPF</div>
        </div>
      </div>

      <div class="usuarios-grid" v-if="users.length > 0">
        <div class="usuario-card" v-for="user in users" :key="user.email">
          <div class="card-header">
            <div class="usuario-avatar">
              {{ user.nome.charAt(0).toUpperCase() }}
            </div>
            <div class="usuario-actions">
              <button class="btn-edit" @click="editUser(user)" title="Editar usuário">
                <span class="icon">✏️</span>
                <span class="text">Editar</span>
              </button>
              <button class="btn-delete" @click="confirmDelete(user)" title="Excluir usuário">
                <span class="icon">🗑️</span>
                <span class="text">Excluir</span>
              </button>
            </div>
          </div>
          <div class="usuario-info">
            <h3 class="usuario-nome">{{ user.nome }}</h3>
            <p class="usuario-email">{{ user.email }}</p>
            <div class="usuario-details" v-if="user.telefone || user.cpf">
              <span v-if="user.telefone" class="detail-item">📞 {{ user.telefone }}</span>
              <span v-if="user.cpf" class="detail-item">🆔 {{ formatCpf(user.cpf) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" v-else>
        <div class="empty-icon">👤</div>
        <h3>Nenhum usuário cadastrado</h3>
        <p>Os usuários cadastrados na promoção aparecerão aqui.</p>
      </div>
    </div>

    <!-- Modal de Edição -->
    <div class="modal-overlay" v-if="showEditModal" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>✏️ Editar Usuário</h3>
          <button class="modal-close" @click="closeEditModal">×</button>
        </div>
        <form @submit.prevent="saveUser" class="edit-form">
          <div class="form-group">
            <label for="edit-nome">Nome Completo:</label>
            <input 
              id="edit-nome"
              v-model="editingUser.nome" 
              type="text" 
              required 
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="edit-email">Email:</label>
            <input 
              id="edit-email"
              v-model="editingUser.email" 
              type="email" 
              required 
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="edit-telefone">Telefone:</label>
            <input 
              id="edit-telefone"
              v-model="editingUser.telefone" 
              type="text" 
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="edit-cpf">CPF:</label>
            <input 
              id="edit-cpf"
              v-model="editingUser.cpf" 
              type="text" 
              class="form-input"
            />
          </div>
          <div class="modal-actions">
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
    <div class="modal-overlay" v-if="showDeleteModal" @click="closeDeleteModal">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h3>🗑️ Confirmar Exclusão</h3>
          <button class="modal-close" @click="closeDeleteModal">×</button>
        </div>
        <div class="delete-confirmation">
          <p>Tem certeza que deseja excluir este usuário?</p>
          <div class="user-preview">
            <div class="usuario-avatar small">
              {{ userToDelete?.nome?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <strong>{{ userToDelete?.nome }}</strong><br>
              {{ userToDelete?.email }}
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" @click="closeDeleteModal">
              Cancelar
            </button>
            <button class="btn-delete-confirm" @click="deleteUser">
              🗑️ Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface User {
  nome: string
  email: string
  telefone?: string
  cpf?: string
  senha: string
}

const users = ref<User[]>([])
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingUser = ref<User>({ nome: '', email: '', telefone: '', cpf: '', senha: '' })
const originalEmail = ref('')
const userToDelete = ref<User | null>(null)

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

const formatCpf = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

const editUser = (user: User) => {
  editingUser.value = { ...user }
  originalEmail.value = user.email
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingUser.value = { nome: '', email: '', telefone: '', cpf: '', senha: '' }
  originalEmail.value = ''
}

const saveUser = () => {
  try {
    const userIndex = users.value.findIndex(u => u.email === originalEmail.value)
    if (userIndex !== -1) {
      users.value[userIndex] = { ...editingUser.value }
      localStorage.setItem('registered_users', JSON.stringify(users.value))
      
      // Atualizar usuário atual se for o mesmo
      const currentUser = localStorage.getItem('currentUser')
      if (currentUser) {
        const current = JSON.parse(currentUser)
        if (current.email === originalEmail.value) {
          localStorage.setItem('currentUser', JSON.stringify(editingUser.value))
        }
      }
    }
    closeEditModal()
  } catch (error) {
    console.error('Erro ao salvar usuário:', error)
  }
}

const confirmDelete = (user: User) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

const deleteUser = () => {
  if (!userToDelete.value) return
  
  try {
    users.value = users.value.filter(u => u.email !== userToDelete.value!.email)
    localStorage.setItem('registered_users', JSON.stringify(users.value))
    
    // Se o usuário excluído for o atual, fazer logout
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const current = JSON.parse(currentUser)
      if (current.email === userToDelete.value.email) {
        localStorage.removeItem('currentUser')
        // Recarregar a página para resetar o estado
        window.location.reload()
      }
    }
    
    closeDeleteModal()
  } catch (error) {
    console.error('Erro ao excluir usuário:', error)
  }
}

let userLoadInterval: number | null = null

onMounted(() => {
  loadUsers()
  // Recarregar usuários periodicamente (reduced frequency for better performance)
  userLoadInterval = setInterval(loadUsers, 10000)
})

onUnmounted(() => {
  if (userLoadInterval) {
    clearInterval(userLoadInterval)
  }
})
</script>

<style scoped>
.usuarios-section {
  padding: 40px 0 60px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 1rem;
}

.section-description {
  font-size: 1.1rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

.usuarios-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #64748b;
  font-weight: 500;
}

.usuarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.usuario-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.usuario-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.15);
}

.usuario-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.usuario-avatar.small {
  width: 40px;
  height: 40px;
  font-size: 1rem;
}

.usuario-info {
  flex: 1;
}

.usuario-nome {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.usuario-email {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.usuario-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.detail-item {
  color: #64748b;
  font-size: 0.85rem;
  background: #f8fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.usuario-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-edit .text,
.btn-delete .text {
  font-size: 0.8rem;
}

.btn-edit .icon,
.btn-delete .icon {
  font-size: 0.9rem;
}

.btn-edit {
  background: #f1f5f9;
  color: #3b82f6;
}

.btn-edit:hover {
  background: #3b82f6;
  color: white;
}

.btn-delete {
  background: #fef2f2;
  color: #ef4444;
}

.btn-delete:hover {
  background: #ef4444;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: #64748b;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #94a3b8;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.modal-close:hover {
  background: #f1f5f9;
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
  color: #374151;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-cancel,
.btn-save,
.btn-delete-confirm {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #f1f5f9;
}

.btn-save {
  background: #3b82f6;
  color: white;
}

.btn-save:hover {
  background: #2563eb;
}

.btn-delete-confirm {
  background: #ef4444;
  color: white;
}

.btn-delete-confirm:hover {
  background: #dc2626;
}

.delete-confirmation {
  padding: 1.5rem;
}

.delete-confirmation p {
  margin-bottom: 1rem;
  color: #64748b;
}

.user-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .usuarios-grid {
    grid-template-columns: 1fr;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .usuario-actions {
    align-self: stretch;
    justify-content: center;
  }
  
  .btn-edit,
  .btn-delete {
    flex: 1;
    justify-content: center;
    padding: 0.75rem 1rem;
  }
  
  .usuario-details {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .detail-item {
    align-self: flex-start;
  }
  
  .usuario-card {
    padding: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .usuarios-stats {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    text-align: center;
  }
}
</style>