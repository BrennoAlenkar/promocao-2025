import { ref, computed } from 'vue'

interface User {
  id: string
  nome: string
  email: string
  telefone?: string
  cpf?: string
}

interface LoginData {
  email: string
  senha: string
}

interface RegisterData {
  nome: string
  email: string
  telefone: string
  cpf: string
  senha: string
}

const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)

  const login = async (credentials: LoginData) => {
    isLoading.value = true
    error.value = null
    
    try {
      // simula um delay da API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // procura nos usuários salvos no localStorage
      const savedUsers = localStorage.getItem('registered_users')
      if (savedUsers) {
        const users = JSON.parse(savedUsers)
        const foundUser = users.find((u: any) => 
          u.email === credentials.email && u.senha === credentials.senha
        )
        
        if (foundUser) {
          user.value = {
            id: foundUser.id || Date.now().toString(),
            nome: foundUser.nome,
            email: foundUser.email,
            telefone: foundUser.telefone,
            cpf: foundUser.cpf
          }
          localStorage.setItem('currentUser', JSON.stringify(user.value))
          return { success: true }
        } else {
          error.value = 'Email ou senha incorretos'
          return { success: false, error: error.value }
        }
      } else {
        error.value = 'Nenhum usuário cadastrado encontrado'
        return { success: false, error: error.value }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro no login'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterData) => {
    isLoading.value = true
    error.value = null
    
    try {
      // delay fake também
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const newUser: User = {
        id: Date.now().toString(),
        nome: userData.nome,
        email: userData.email,
        telefone: userData.telefone,
        cpf: userData.cpf
      }
      
      // pega os usuários já salvos
      const savedUsers = localStorage.getItem('registered_users')
      const users = savedUsers ? JSON.parse(savedUsers) : []
      
      // verifica se o email já existe
      const emailExists = users.some((u: any) => u.email === userData.email)
      if (emailExists) {
        error.value = 'Este email já está cadastrado'
        return { success: false, error: error.value }
      }
      
      const userWithPassword = { ...newUser, senha: userData.senha, createdAt: new Date().toISOString() }
      users.push(userWithPassword)
      localStorage.setItem('registered_users', JSON.stringify(users))
      
      user.value = newUser
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      
      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro no cadastro'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    user.value = null
    localStorage.removeItem('currentUser')
  }

  return {
    user: computed(() => user.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    login,
    register,
    logout
  }
}