const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

interface User {
  id: string
  nome: string
  email: string
  telefone: string
  cpf: string
  createdAt: string
}

interface LoginData {
  email: string
  senha: string
}

interface RegisterData {
  nome: string
  email: string
  senha: string
  telefone: string
  cpf: string
}

interface Participacao {
  id: string
  userId: string
  codigoPromocional: string
  dataParticipacao: string
  status: 'ativa' | 'processada' | 'premiada'
}

class ApiService {
  private token: string | null = null

  constructor() {
    this.token = localStorage.getItem('auth_token')
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição')
      }
      
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // login do usuário
  async login(credentials: LoginData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    // salva o token se deu certo
    if (response.success && response.data?.token) {
      this.token = response.data.token
      localStorage.setItem('auth_token', this.token)
    }
    
    return response
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>('/usuarios/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    
    // salva o token também no cadastro
    if (response.success && response.data?.token) {
      this.token = response.data.token
      localStorage.setItem('auth_token', this.token)
    }
    
    return response
  }

  async logout(): Promise<void> {
    this.token = null
    localStorage.removeItem('auth_token')
  }

  // perfil do usuário
  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/usuarios/profile')
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/usuarios/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  // métodos das promoções
  async getPromocoes(filtros?: { ativo?: boolean; tipo?: string }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams()
    if (filtros?.ativo !== undefined) params.append('ativo', String(filtros.ativo))
    if (filtros?.tipo) params.append('tipo', filtros.tipo)
    
    // monta a query string
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<any[]>(`/promocoes${query}`)
  }

  async getPromocao(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/promocoes/${id}`)
  }

  async createPromocao(promocao: any): Promise<ApiResponse<any>> {
    return this.request<any>('/promocoes', {
      method: 'POST',
      body: JSON.stringify(promocao),
    })
  }

  async updatePromocao(id: string, promocao: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/promocoes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(promocao),
    })
  }

  async deletePromocao(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/promocoes/${id}`, {
      method: 'DELETE',
    })
  }

  // Participações (compatibilidade com o sistema anterior)
  async participar(codigoPromocional: string): Promise<ApiResponse<Participacao>> {
    return this.request<Participacao>('/promocoes', {
      method: 'POST',
      body: JSON.stringify({ codigoPromocional }),
    })
  }

  async getMinhasParticipacoes(): Promise<ApiResponse<Participacao[]>> {
    return this.request<Participacao[]>('/promocoes')
  }

  async getHistoricoParticipacoes(userId: string): Promise<ApiResponse<Participacao[]>> {
    return this.request<Participacao[]>(`/promocoes?userId=${userId}`)
  }

  // Sorteios e Prêmios (usando promoções)
  async getSorteios(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/promocoes?tipo=sorteio')
  }

  async getGanhadores(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/promocoes?premiadas=true')
  }

  // Utilitários
  isAuthenticated(): boolean {
    return !!this.token
  }

  getToken(): string | null {
    return this.token
  }
}

// Instância única do serviço
export const apiService = new ApiService()

// Exports dos tipos
export type { 
  User, 
  LoginData, 
  RegisterData, 
  Participacao, 
  ApiResponse 
}