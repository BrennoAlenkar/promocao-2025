import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Lazy loading das páginas para melhor performance
const HomePage = () => import('../views/HomePage.vue')
const AdminPage = () => import('../views/AdminPage.vue')
const RegulamentoPage = () => import('../views/RegulamentoPage.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: 'Super Promoção 2025',
      description: 'A maior campanha promocional do ano!'
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage,
    meta: {
      title: 'Painel Administrativo - Super Promoção 2025',
      description: 'Gestão de usuários e configurações',
      requiresAuth: true
    }
  },
  {
    path: '/regulamento',
    name: 'Regulamento',
    component: RegulamentoPage,
    meta: {
      title: 'Regulamento - Super Promoção 2025',
      description: 'Regulamento oficial da Super Promoção 2025'
    }
  },
  // Redirecionamento para /admin/usuarios -> /admin
  {
    path: '/admin/usuarios',
    redirect: '/admin'
  },
  // Fallback para rotas não encontradas
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0 }
    }
  }
})

// Guard para rotas que requerem autenticação
router.beforeEach((to, _from, next) => {
  // Atualizar título da página
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // Verificar autenticação se necessário
  if (to.meta.requiresAuth) {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      console.log('Usuário não autenticado, mas permitindo acesso temporário para debug')
      // Para debug: permitir acesso temporário
      // next({ name: 'Home', query: { showAuth: 'true' } })
      // return
    }
  }

  next()
})

export default router