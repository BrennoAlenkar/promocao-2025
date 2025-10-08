<template>
  <teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ isLoginMode ? 'Entrar' : 'Criar Conta' }}</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        
        <div class="modal-body">
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <!-- Formulário de Login -->
          <form v-if="isLoginMode" @submit.prevent="handleLogin" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="loginForm.email"
                type="email"
                required
                placeholder="seu@email.com"
              >
            </div>
            
            <div class="form-group">
              <label for="senha">Senha</label>
              <input
                id="senha"
                v-model="loginForm.senha"
                type="password"
                required
                placeholder="Sua senha"
              >
            </div>
            
            <button type="submit" class="btn-primary" :disabled="isLoading">
              <span v-if="isLoading">Entrando...</span>
              <span v-else>🔑 Entrar</span>
            </button>
          </form>
          
          <!-- Formulário de Cadastro -->
          <form v-else @submit.prevent="handleRegister" class="auth-form">
            <div class="form-group">
              <label for="nome">Nome Completo</label>
              <input
                id="nome"
                v-model="registerForm.nome"
                type="text"
                required
                placeholder="Seu nome completo"
              >
            </div>
            
            <div class="form-group">
              <label for="email-reg">Email</label>
              <input
                id="email-reg"
                v-model="registerForm.email"
                type="email"
                required
                placeholder="seu@email.com"
              >
            </div>
            
            <div class="form-group">
              <label for="telefone">Telefone</label>
              <input
                id="telefone"
                v-model="registerForm.telefone"
                type="tel"
                required
                placeholder="(11) 99999-9999"
              >
            </div>
            
            <div class="form-group">
              <label for="cpf">CPF</label>
              <input
                id="cpf"
                v-model="registerForm.cpf"
                type="text"
                required
                placeholder="000.000.000-00"
                @input="formatCPF"
              >
            </div>
            
            <div class="form-group">
              <label for="senha-reg">Senha</label>
              <input
                id="senha-reg"
                v-model="registerForm.senha"
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                minlength="6"
              >
            </div>
            
            <div class="form-group checkbox-group">
              <label>
                <input type="checkbox" v-model="acceptTerms" required>
                Aceito os <a href="#" @click.prevent>termos e condições</a>
              </label>
            </div>
            
            <button type="submit" class="btn-primary" :disabled="isLoading || !acceptTerms">
              <span v-if="isLoading">Cadastrando...</span>
              <span v-else>Criar Conta</span>
            </button>
          </form>
        </div>
        
        <div class="modal-footer">
          <p v-if="isLoginMode">
            Não tem conta? 
            <a href="#" @click.prevent="toggleMode">Cadastre-se</a>
          </p>
          <p v-else>
            Já tem conta? 
            <a href="#" @click.prevent="toggleMode">Faça login</a>
          </p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '../composables/useAuth'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { login, register, isLoading, error } = useAuth()

const isLoginMode = ref(true)
const acceptTerms = ref(false)

const loginForm = reactive({
  email: '',
  senha: ''
})

const registerForm = reactive({
  nome: '',
  email: '',
  telefone: '',
  cpf: '',
  senha: ''
})

const clearForms = () => {
  Object.assign(loginForm, { email: '', senha: '' })
  Object.assign(registerForm, { nome: '', email: '', telefone: '', cpf: '', senha: '' })
  acceptTerms.value = false
}

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  clearForms() // Usar a função para limpar formulários ao trocar
}

const closeModal = () => {
  emit('close')
}

const handleLogin = async () => {
  const result = await login(loginForm)
  if (result.success) {
    clearForms() // Limpa os campos após login bem-sucedido
    emit('success')
    closeModal()
  }
}

const handleRegister = async () => {
  const result = await register(registerForm)
  if (result.success) {
    clearForms() // Limpa os campos após cadastro bem-sucedido
    emit('success')
    closeModal()
  }
}

const formatCPF = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  registerForm.cpf = value
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: var(--neutral-dark);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.error-message {
  background: #fee;
  color: #d33;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #fcc;
  font-size: 0.9rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--neutral-dark);
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-mint);
}

.checkbox-group label {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.checkbox-group a {
  color: var(--accent-mint);
  text-decoration: none;
}

.checkbox-group a:hover {
  text-decoration: underline;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.modal-footer {
  padding: 1rem 1.5rem;
  text-align: center;
  border-top: 1px solid #eee;
  background: #f9f9f9;
  border-radius: 0 0 1rem 1rem;
}

.modal-footer p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.modal-footer a {
  color: var(--accent-mint);
  text-decoration: none;
  font-weight: 600;
}

.modal-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .modal-content {
    margin: 0.5rem;
    max-width: none;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }
}
</style>